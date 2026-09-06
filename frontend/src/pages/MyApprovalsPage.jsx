import { useEffect, useState } from "react";
import { getExpenses, getApprovalStatus } from "../api/expenseService.js";
import ApprovalStepper from "../features/approval/components/ApprovalStepper.jsx";
import { ChevronDown, ChevronUp } from "lucide-react";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function toFullSteps(timeline = []) {
  return timeline.map((step) => ({
    step: step.sequence,
    role: step.approver_name || `Approver ${step.sequence}`,
    name:
      step.status === "approved"
        ? `Approved${step.comment ? ` — "${step.comment}"` : ""}`
        : step.status === "rejected"
          ? `Rejected — "${step.comment || "No reason given"}"`
          : "Awaiting decision",
    description: step.acted_at ? formatDate(step.acted_at) : null,
    status: String(step.status || "pending").toUpperCase(),
  }));
}

export default function MyApprovalsPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [detailCache, setDetailCache] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getExpenses()
      .then((rows) => {
        if (!active) return;
        setExpenses(Array.isArray(rows) ? rows : []);
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
  }, []);

  async function toggleExpand(id) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);

    if (!detailCache[id]) {
      setDetailLoading(true);
      try {
        const detail = await getApprovalStatus(id);
        setDetailCache((prev) => ({ ...prev, [id]: detail }));
      } catch (err) {
        setDetailCache((prev) => ({
          ...prev,
          [id]: { error: "Failed to load approval details" },
        }));
      } finally {
        setDetailLoading(false);
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-manrope font-bold text-2xl text-forest-900 mb-6">
        My Approvals
      </h1>

      {loading && (
        <div className="text-sm text-surface-500">Loading expenses...</div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="text-sm text-surface-500">
          No expenses submitted yet.
        </div>
      )}

      {!loading &&
        !error &&
        expenses.map((expense) => {
          const isExpanded = expandedId === expense.id;
          const detail = detailCache[expense.id];
          const amount = Number(
            expense.converted_amount || expense.amount || 0,
          );
          const currency =
            expense.base_currency || expense.currency || "USD";

          return (
            <div key={expense.id} className="ethereal-card mb-3 !p-0 overflow-hidden">
              <button
                onClick={() => toggleExpand(expense.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-manrope font-semibold text-sm text-forest-900">
                    {expense.vendor || expense.description || "Expense"}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {formatDate(expense.submitted_at)} • {currency}{" "}
                    {amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                    {String(expense.status || "pending").replace(/_/g, " ")}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-surface-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-surface-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 py-5 border-t border-surface-100">
                  {detailLoading && !detail && (
                    <p className="text-sm text-surface-500">
                      Loading approval details...
                    </p>
                  )}
                  {detail?.error && (
                    <p className="text-sm text-red-600">{detail.error}</p>
                  )}
                  {detail && !detail.error && (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-4">
                        {detail.approvedCount} of {detail.totalSteps} approvals
                      </p>
                      <ApprovalStepper
                        steps={toFullSteps(detail.timeline)}
                        variant="full"
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}