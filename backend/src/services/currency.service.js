import { env } from "../config/env.js";
import { redis } from "../config/redis.js";

const COMMON_CURRENCIES = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "AED", name: "UAE Dirham", symbol: "AED" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
];

export function getCurrencyList() {
  return COMMON_CURRENCIES;
}

export async function getRates(base) {
  const baseCode = String(base).toUpperCase();
  const cacheKey = `fx:rates:${baseCode}`;

  // 1. Try reading from Redis cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (parsed?.base && parsed?.rates) {
        return parsed;
      }
    }
  } catch (err) {
    // If Redis fails, skip the cache and continue
    console.warn("Redis fx cache read failed:", err.message);
  }

  // 2. Fetch from external exchange rates API
  const url = `${env.EXCHANGE_API_URL}/latest/${baseCode}`;
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    const error = new Error("Exchange rates service temporarily unavailable");
    error.status = 503;
    throw error;
  }

  if (!res.ok) {
    const error = new Error(`Failed to fetch exchange rates: ${res.statusText}`);
    error.status = 503;
    throw error;
  }

  const data = await res.json();
  if (data?.result === "error" || data?.["error-type"] === "unsupported-code" || !data?.rates) {
    const error = new Error(`Unsupported or invalid currency code: ${baseCode}`);
    error.status = 400;
    throw error;
  }

  if (data?.result !== "success") {
    const error = new Error("Exchange rates service temporarily unavailable");
    error.status = 503;
    throw error;
  }

  const result = {
    base: data.base_code || baseCode,
    rates: data.rates,
  };

  // 3. Cache in Redis with 3600s TTL
  try {
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
  } catch (err) {
    console.warn("Redis fx cache write failed:", err.message);
  }

  return result;
}

export async function convertCurrency(amount, from, to) {
  const numAmount = Number(amount);
  const source = String(from).toUpperCase();
  const target = String(to).toUpperCase();

  if (source === target) {
    return { rate: 1, convertedAmount: numAmount };
  }

  const { rates } = await getRates(source);
  const targetRate = rates?.[target];

  if (!targetRate) {
    throw new Error(`Exchange rate not found from ${source} to ${target}`);
  }

  const rate = Number(targetRate);
  return {
    rate,
    convertedAmount: Number((numAmount * rate).toFixed(2)),
  };
}
