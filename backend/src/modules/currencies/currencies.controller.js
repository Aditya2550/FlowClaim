import { getCurrencyList, getRates } from "../../services/currency.service.js";

export async function getCurrencies(req, res) {
  try {
    const list = getCurrencyList();
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch currency list" });
  }
}

export async function getExchangeRates(req, res) {
  const currencyParam = String(req.params.currency || "").toUpperCase();

  if (!/^[A-Z]{3}$/.test(currencyParam)) {
    return res.status(400).json({ error: "Invalid currency code. Must be a 3-letter ISO code." });
  }

  try {
    const data = await getRates(currencyParam);
    return res.status(200).json(data);
  } catch (error) {
    const statusCode = error.status || 503;
    return res.status(statusCode).json({ error: error.message || "Failed to fetch exchange rates" });
  }
}
