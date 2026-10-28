import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getExpenses, getApprovalStatus } from "../api/expenseService.js";
import ApprovalStepper from "../features/approval/components/ApprovalStepper.jsx";
import { ChevronDown, ChevronUp, X, Receipt, ArrowRight } from "lucide-react";

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
        ? `Approved${step.comment ? ` - "${step.comment}"` : ""}`
        : step.status === "rejected"
          ? `Rejected - "${step.comment || "No reason given"}"`
          : "Awaiting decision",
    description: step.acted_at ? formatDate(step.acted_at) : null,
    status: String(step.status || "pending").toUpperCase(),
  }));
}

export default function MyApprovalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [detailCache, setDetailCache] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [notice, setNotice] = useState("");

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
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          (typeof err?.response?.data === "string" ? err.response.data : "") ||
          err?.message ||
          "Failed to load expenses";
        setError(msg);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleExpand = useCallback(
    async (id) => {
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
    },
    [expandedId, detailCache],
  );

  useEffect(() => {
    if (loading) return;
    const targetExpenseId = searchParams.get("expense");
    if (!targetExpenseId) return;

    const matched = expenses.some((e) => e.id === targetExpenseId);
    if (matched) {
      toggleExpand(targetExpenseId);
      setHighlightedId(targetExpenseId);
      setTimeout(() => {
        const el = document.getElementById(`my-approval-${targetExpenseId}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 3000);

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("expense");
          return next;
        },
        { replace: true },
      );
      return () => clearTimeout(timer);
    } else {
      setNotice("Expense not found");
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("expense");
          return next;
        },
        { replace: true },
      );
    }
  }, [loading, expenses, searchParams, setSearchParams, toggleExpand]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-manrope font-bold text-2xl text-forest-900 mb-6">
        My Approvals
      </h1>

      {notice && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between animate-fade-in shadow-sm">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-amber-600 hover:text-amber-800 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading && (
        <div className="text-sm text-surface-500">Loading expenses...</div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-600 bg-red-50/80 border border-red-200/60 p-4 rounded-2xl mb-4">
          {error}
        </div>
      )}

      {!loading && !error && expenses.length === 0 && (
        <div className="ethereal-card text-center py-12 px-6 flex flex-col items-center justify-center max-w-lg mx-auto mt-6 border border-forest-500/10 shadow-sm rounded-3xl animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-neon-500/10 border border-neon-500/25 flex items-center justify-center text-forest-700 mb-5 shadow-[0_0_20px_rgba(0,255,102,0.12)]">
            <Receipt className="w-8 h-8 text-forest-700" />
          </div>
          <h2 className="font-manrope font-bold text-xl text-forest-900 mb-2">
            No expenses submitted yet
          </h2>
          <p className="text-surface-500 text-sm max-w-sm mb-6 leading-relaxed">
            Start your fast expense approval journey by adding or logging an expense. Track approvals in real-time across your organization.
          </p>
          <Link
            to="/expenses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-500 text-white font-manrope font-semibold text-sm hover:bg-forest-600 transition-colors shadow-md shadow-forest-500/15"
          >
            <span>Start Your Expense Journey</span>
            <ArrowRight className="w-4 h-4 text-neon-400" />
          </Link>
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
            <div
              key={expense.id}
              id={`my-approval-${expense.id}`}
              className={`ethereal-card mb-3 !p-0 overflow-hidden transition-all duration-300 ${
                highlightedId === expense.id
                  ? "ring-2 ring-forest-500 bg-forest-50/40 border-forest-300 shadow-md"
                  : ""
              }`}
            >
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