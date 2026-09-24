import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ALLOWED_CATEGORIES = ["Travel", "Food", "Office", "Other"];

const EXTRACTION_PROMPT = `You are an expense receipt data extractor for a corporate reimbursement system.

Analyze the receipt/bill image and extract the following fields as JSON only — no markdown, no code fences, no explanation, just raw JSON.

Return this exact shape:
{
  "vendor": string or null,
  "amount": number or null,
  "currency": string (3-letter ISO code, e.g. "INR", "USD") or null,
  "date": string in YYYY-MM-DD format or null,
  "category": one of ["Travel", "Food", "Office", "Other"] or null,
  "gst": number or null,
  "invoiceNumber": string or null,
  "paymentMethod": string or null,
  "confidence": {
    "vendor": number between 0 and 1,
    "amount": number between 0 and 1,
    "currency": number between 0 and 1,
    "date": number between 0 and 1,
    "category": number between 0 and 1
  }
}

Rules:
- If a field is unclear, blurry, or not present on the receipt, return null for that field — do NOT guess or fabricate values.
- amount must be the final total amount charged/paid, not a subtotal.
- category must be inferred from context (e.g. hotel/flight/taxi/fuel = Travel, restaurant/meal = Food, stationery/coworking = Office, everything else = Other).
- confidence scores reflect how certain you are about each field based on image clarity and field presence.
- Respond with ONLY the JSON object, nothing else.`;

function isMostlyNull(data) {
  const fields = [
    data.vendor,
    data.amount,
    data.currency,
    data.date,
    data.category,
  ];
  const nullCount = fields.filter((f) => f === null || f === undefined).length;
  return nullCount >= 3;
}

async function extractWithGroq(imageBuffer, mimeType) {
  const apiKey = String(process.env.GROQ_API_KEY || "").trim();
  const base64Image = imageBuffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  const groqModels = [
    "llama-3.2-11b-vision-instruct",
    "llama-3.2-90b-vision-instruct",
    "llava-v1.5-7b-4096",
  ];

  let lastError = null;

  for (const modelName of groqModels) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: EXTRACTION_PROMPT },
                { type: "image_url", image_url: { url: dataUrl } },
              ],
            },
          ],
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message || `Groq HTTP ${response.status}`);
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Empty content returned from Groq Vision API");
      }

      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleaned);
      console.log(`[OCR Service] Successfully extracted receipt using Groq model: ${modelName}`);
      return parsed;
    } catch (err) {
      console.warn(`[OCR Service] Groq model '${modelName}' error:`, err.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("Groq Vision API failed");
}

export async function extractReceiptData(imageBuffer, mimeType) {
  // Primary Engine: Gemini 3.6 Flash
  const geminiKey = String(process.env.GEMINI_API_KEY || "").trim();
  const groqKey = String(process.env.GROQ_API_KEY || "").trim();

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function callGeminiWithRetry(retries = 3) {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    let lastError = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await model.generateContent([EXTRACTION_PROMPT, imagePart]);
        const responseText = result.response.text();
        const cleaned = responseText
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        return JSON.parse(cleaned);
      } catch (err) {
        lastError = err;
        const is503OrRateLimit =
          err.message?.includes("503") ||
          err.message?.includes("high demand") ||
          err.message?.includes("429");

        if (is503OrRateLimit && attempt < retries) {
          console.warn(
            `[OCR Service] Gemini 3.6 Flash high demand spike (Attempt ${attempt}/${retries}). Retrying in 1.5s...`
          );
          await delay(1500);
        } else {
          throw err;
        }
      }
    }
    throw lastError;
  }

  // Try Gemini 3.6 Flash first if key is present
  if (geminiKey && geminiKey !== "API_KEY_GEMINI") {
    try {
      console.log("[OCR Service] Processing receipt with Gemini 3.6 Flash...");
      let parsed = await callGeminiWithRetry();

      if (isMostlyNull(parsed)) {
        console.log("[OCR Service] First attempt mostly null, retrying...");
        try {
          const retryResult = await callGeminiWithRetry();
          if (!isMostlyNull(retryResult)) {
            parsed = retryResult;
          }
        } catch (err) {
          // retry failed, keep original nulls
        }
      }

      return parsed;
    } catch (geminiErr) {
      console.warn("[OCR Service] Gemini 3.6 Flash failed:", geminiErr.message || geminiErr);
      if (!groqKey) throw geminiErr;
    }
  }

  // Optional Fallback to Groq Vision if configured
  if (groqKey) {
    console.log("[OCR Service] Falling back to Groq Vision API...");
    return await extractWithGroq(imageBuffer, mimeType);
  }

  throw new Error("No valid OCR API key configured. Please check GEMINI_API_KEY in backend/.env.");
}
