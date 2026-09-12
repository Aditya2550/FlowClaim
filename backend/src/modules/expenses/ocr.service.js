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

export async function extractReceiptData(imageBuffer, mimeType) {
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };

  async function callGemini() {
    const result = await model.generateContent([EXTRACTION_PROMPT, imagePart]);
    const responseText = result.response.text();
    const cleaned = responseText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    return JSON.parse(cleaned);
  }

  let parsed = await callGemini();

  if (isMostlyNull(parsed)) {
    console.log("First attempt mostly null, retrying...");
    try {
      const retryResult = await callGemini();
      if (!isMostlyNull(retryResult)) {
        parsed = retryResult;
      }
    } catch (err) {
      // retry failed, keep original nulls
    }
  }

  return parsed;
}
