import { useEffect, useMemo, useState } from "react";
import { getExpenses } from "../../../api/expenseService.js";
import ApprovalStepper from "../../approval/components/ApprovalStepper.jsx";
import { Filter, Download, ChevronDown } from "lucide-react";

const CATEGORY_TAGS = {
  Office: { bg: "bg-emerald-50 text-emerald-700" },
  Food: { bg: "bg-amber-50 text-amber-700" },
  Other: { bg: "bg-cyan-50 text-cyan-700" },
  Travel: { bg: "bg-blue-50 text-blue-700" },
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function toSteps(rawSteps = []) {
  return rawSteps.map((step) => ({
    step: step.sequence,
    role: `Approver ${step.sequence}`,
    name: step.comment || "Awaiting decision",
    status: String(step.status || "pending").toUpperCase(),
  }));
}

export default function ExpenseList({ refreshKey = 0 }) {
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getExpenses()
      .then((rows) => {
        if (!active) return;
        setItems(Array.isArray(rows) ? rows : []);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to load expenses",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const visibleItems = useMemo(
    () => (showAll ? items : items.slice(0, 3)),
    [items, showAll],
  );
  const remaining = Math.max(items.length - 3, 0);

  return (
    <div className="ethereal-card !p-0 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <h2 className="font-manrope font-bold text-lg text-forest-900">
          Expense Ledger
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl hover:bg-surface-100 transition-colors text-surface-400">
            <Filter className="w-4 h-4" />
          </button>
          <button
            className="p-2.5 rounded-xl hover:bg-surface-100 transition-colors text-surface-400"
            onClick={() => setShowAll((prev) => !prev)}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] px-6 py-3 bg-surface-50">
        <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
          Details
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
          Category
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
          Lifecycle Status
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500 text-right">
          Amount
        </span>
      </div>

      {/* Rows */}
      {loading && (
        <div className="px-6 py-10 text-sm text-surface-500">
          Loading expenses...
        </div>
      )}

      {!loading && error && (
        <div className="px-6 py-10 text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <div className="px-6 py-10 text-sm text-surface-500">
          No expenses yet. Submit your first claim.
        </div>
      )}

      {!loading && !error && visibleItems.length > 0 && (
        <div>
          {visibleItems.map((expense, index) => {
            const catStyle =
              CATEGORY_TAGS[expense.category] || CATEGORY_TAGS.Other;
            const amount = Number(
              expense.converted_amount || expense.amount || 0,
            );
            const currency = expense.base_currency || expense.currency || "USD";
            const stepper = toSteps(expense.approval_steps || []);

            return (
              <div
                key={expense.id}
                className={`grid grid-cols-[2fr_1fr_1.5fr_1fr] items-center px-6 py-5 transition-colors hover:bg-surface-50 cursor-pointer ${
                  index > 0 ? "bg-white" : ""
                }`}
              >
                {/* Details */}
                <div>
                  <p className="font-manrope font-semibold text-sm text-forest-900">
                    {expense.vendor || expense.description || "Expense"}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {formatDate(expense.submitted_at)} • ID: #
                    {String(expense.id || "").slice(0, 8)}
                  </p>
                </div>

                {/* Category Badge */}
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${catStyle.bg}`}
                  >
                    {expense.category}
                  </span>
                </div>

                {/* Mini Stepper */}
                <div className="flex items-center gap-3">
                  <ApprovalStepper steps={stepper} variant="mini" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                    {String(expense.status || "pending").replace(/_/g, " ")}
                  </span>
                </div>

                {/* Amount */}
                <p className="font-manrope font-bold text-base text-forest-900 text-right">
                  {currency}{" "}
                  {amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Show More */}
      {!loading && !error && !showAll && remaining > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-4 text-center text-xs font-bold uppercase tracking-wider text-surface-500 hover:text-forest-600 hover:bg-surface-50 transition-colors"
        >
          Show {remaining} More Records
        </button>
      )}
    </div>
  );
}
