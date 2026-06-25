import { useEffect, useMemo, useState } from "react";
import { createExpense } from "../../../api/expenseService.js";
import { getCurrencies, getRates } from "../../../api/currencyService.js";
import { scanReceipt } from "../../../api/ocrService.js";
import { Upload, CalendarDays, FileSearch } from "lucide-react";
import Button from "../../../components/ui/Button.jsx";

const CATEGORIES = [
  { id: "Travel", label: "Travel" },
  { id: "Food", label: "Food" },
  { id: "Office", label: "Office" },
  { id: "Other", label: "Other" },
];

const DEFAULT_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "INR", name: "Indian Rupee", symbol: "Rs" },
  { code: "EUR", name: "Euro", symbol: "EUR" },
  { code: "GBP", name: "British Pound", symbol: "GBP" },
];

export default function ExpenseForm({ onClose, onSubmitted }) {
  const [form, setForm] = useState({
    title: "",
    category: "Travel",
    amount: "",
    currency: "USD",
    companyCurrency: "INR",
    vendor: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    receipt_url: "",
  });
  const [scanner, setScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [error, setError] = useState("");
  const [currencies, setCurrencies] = useState(DEFAULT_CURRENCIES);
  const [fxRates, setFxRates] = useState({});

  useEffect(() => {
    let active = true;
    getCurrencies()
      .then((data) => {
        if (!active || !Array.isArray(data) || data.length === 0) return;
        const mapped = data.map((item) => ({
          code: item.code,
          name: item.currency || item.name || item.code,
          symbol: item.symbol || item.code,
        }));
        setCurrencies(mapped);
      })
      .catch(() => {
        // Keep defaults when API is unavailable.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!form.currency) return undefined;

    getRates(form.currency)
      .then((data) => {
        if (!active) return;
        setFxRates(data?.rates || {});
      })
      .catch(() => {
        if (active) setFxRates({});
      });

    return () => {
      active = false;
    };
  }, [form.currency]);

  const converted = useMemo(() => {
    const raw = Number(form.amount || 0);
    if (!raw) return "0.00";
    if (form.currency === form.companyCurrency) return raw.toFixed(2);
    const rate = Number(fxRates?.[form.companyCurrency] || 0);
    if (!rate) return raw.toFixed(2);
    return (raw * rate).toFixed(2);
  }, [form.amount, form.currency, form.companyCurrency, fxRates]);

  const selectedCurrencySymbol =
    currencies.find((c) => c.code === form.currency)?.symbol || "$";

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    setOcrError("");
    setScanner(true);
    try {
      const extracted = await scanReceipt(file);

      setScanner(false);
      if (extracted?.amount) update("amount", String(extracted.amount));
      if (extracted?.currency)
        update("currency", String(extracted.currency).toUpperCase());
      if (extracted?.merchant) {
        update("vendor", extracted.merchant);
        update("title", `${extracted.merchant} receipt`);
      }
      if (extracted?.expenseDate) update("date", extracted.expenseDate);
      if (
        extracted?.category &&
        CATEGORIES.find((x) => x.id === extracted.category)
      ) {
        update("category", extracted.category);
      }
    } catch {
      setScanner(false);
      setOcrError("Receipt scan failed. You can still fill the form manually.");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Title is required");
    if (!form.amount || Number(form.amount) <= 0)
      return setError("Amount must be greater than zero");

    setLoading(true);
    try {
      const created = await createExpense({
        amount: Number(form.amount),
        currency: form.currency,
        category: form.category,
        vendor: form.vendor || form.title,
        description: form.description,
        receipt_url: form.receipt_url || null,
      });

      if (typeof onSubmitted === "function") {
        onSubmitted(created);
      }

      setForm((prev) => ({
        ...prev,
        title: "",
        amount: "",
        vendor: "",
        description: "",
        receipt_url: "",
      }));

      if (onClose) onClose();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to submit expense. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* OCR Drop Zone (inline) */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`relative rounded-xl p-6 text-center transition-all ${
          scanner ? "bg-neon/5" : "bg-surface-50"
        }`}
        style={{ border: "2px dashed rgba(26, 77, 46, 0.12)" }}
      >
        {scanner && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="scanner-line" />
          </div>
        )}
        <div className="flex items-center justify-center gap-3">
          {scanner ? (
            <FileSearch className="w-5 h-5 text-neon-700 animate-pulse-slow" />
          ) : (
            <Upload className="w-5 h-5 text-surface-400" />
          )}
          <p className="text-sm text-surface-500">
            {scanner
              ? "Scanning receipt..."
              : "Drag receipt here for AI extraction"}
          </p>
        </div>
      </div>

      {ocrError && (
        <div className="bg-amber-50 text-amber-700 text-sm rounded-xl px-4 py-3 animate-slide-down">
          {ocrError}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 animate-slide-down">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="What was this expense for?"
          className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => update("category", cat.id)}
              className={`p-3 rounded-xl text-center transition-all text-xs font-medium ${
                form.category === cat.id
                  ? "bg-forest-500 text-white"
                  : "bg-surface-50 text-surface-500 hover:bg-surface-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount + Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-semibold">
              {selectedCurrencySymbol}
            </span>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              placeholder="0.00"
              className="w-full bg-surface-50 rounded-xl pl-9 pr-4 py-3 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
            Currency
          </label>
          <select
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm text-forest-900 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter appearance-none"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Conversion Badge */}
      {form.amount && (
        <div className="bg-neon/5 rounded-xl px-4 py-3 flex items-center justify-between animate-slide-up">
          <span className="text-xs text-forest-600 font-medium">
            Live Conversion
          </span>
          <span className="font-manrope font-bold text-forest-900">
            {converted} {form.companyCurrency}
          </span>
        </div>
      )}

      {/* Date */}
      <div>
        <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
          Date
        </label>
        <div className="relative">
          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            className="w-full bg-surface-50 rounded-xl pl-11 pr-4 py-3 text-sm text-forest-900 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
          Vendor
        </label>
        <input
          value={form.vendor}
          onChange={(e) => update("vendor", e.target.value)}
          placeholder="Merchant or vendor"
          className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Additional details..."
          rows={3}
          className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter resize-none"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          Submit Expense
        </Button>
        {onClose && (
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
