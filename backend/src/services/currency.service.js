import { env } from "../config/env.js";

export async function convertCurrency(amount, from, to) {
  if (from === to) return { rate: 1, convertedAmount: amount };
  const url = `${env.EXCHANGE_API_URL}/convert?from=${from}&to=${to}&amount=${amount}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return { rate: data.info?.rate || 1, convertedAmount: data.result || amount };
  } catch {
    return { rate: 1, convertedAmount: amount };
  }
}
