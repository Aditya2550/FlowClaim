import api from "./axios";

const FALLBACK_CURRENCIES = [
    { country: "India", currency: "Indian Rupee", code: "INR", symbol: "₹" },
    { country: "United States", currency: "US Dollar", code: "USD", symbol: "$" },
    { country: "Eurozone", currency: "Euro", code: "EUR", symbol: "€" }
];

export async function getCurrencies() {
    try {
        const { data } = await api.get("/currencies");
        return data;
    } catch {
        return FALLBACK_CURRENCIES;
    }
}

export async function getRates(base) {
    try {
        const { data } = await api.get(`/exchange-rates/${base}`);
        return data;
    } catch {
        try {
            const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
            const data = await response.json();
            if (!response.ok || data?.result !== "success") {
                return { base, rates: {} };
            }
            return { base: data.base_code || base, rates: data.rates || {} };
        } catch {
            return { base, rates: {} };
        }
    }
}
