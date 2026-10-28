import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getExpenses, getApprovalStatus } from "../api/expenseService.js";
import ApprovalStepper from "../features/approval/components/ApprovalStepper.jsx";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  History,
  FileCheck2,
  Clock,
  Sparkles,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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
    description: step.acted_at ? formatDateTime(step.acted_at) : null,
    status: String(step.status || "pending").toUpperCase(),
  }));
}

const CATEGORY_STYLES = {
  Travel: "bg-blue-50 text-blue-700 border-blue-200",
  Food: "bg-amber-50 text-amber-700 border-amber-200",
  Office: "bg-purple-50 text-purple-700 border-purple-200",
  Other: "bg-surface-100 text-surface-600 border-surface-200",
};

export default function ApprovalHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [detailCache, setDetailCache] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [notice, setNotice] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await getExpenses();
      // Keep only actioned expenses (approved or rejected)
      const actioned = (Array.isArray(rows) ? rows : []).filter((e) =>
        ["approved", "rejected"].includes(String(e.status || "").toLowerCase()),
      );
      setExpenses(actioned);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        "Failed to load approval history";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

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
        } catch {
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

  // Handle deep-linking ?expense=<id> and ?notice=actioned
  useEffect(() => {
    if (loading) return;
    const targetExpenseId = searchParams.get("expense");
    const noticeParam = searchParams.get("notice");

    if (!targetExpenseId) {
      if (noticeParam === "actioned") {
        setNotice("This expense is no longer pending your approval.");
      }
      return;
    }

    const matched = expenses.some((e) => e.id === targetExpenseId);
    if (matched) {
      toggleExpand(targetExpenseId);
      setHighlightedId(targetExpenseId);
      setNotice(
        "This claim was already processed. Review the decision details below.",
      );
      setTimeout(() => {
        const el = document.getElementById(`history-card-${targetExpenseId}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);

      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 3500);

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("expense");
          next.delete("notice");
          return next;
        },
        { replace: true },
      );
      return () => clearTimeout(timer);
    } else {
      setNotice("Expense not found in actioned claims.");
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("expense");
          next.delete("notice");
          return next;
        },
        { replace: true },
      );
    }
  }, [loading, expenses, searchParams, setSearchParams, toggleExpand]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const statusMatch =
        statusFilter === "all" ||
        String(item.status || "").toLowerCase() === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const textMatch =
        !q ||
        (item.vendor && item.vendor.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.employee_name && item.employee_name.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));

      return statusMatch && textMatch;
    });
  }, [expenses, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const approvedCount = expenses.filter(
      (e) => String(e.status).toLowerCase() === "approved",
    ).length;
    const rejectedCount = expenses.filter(
      (e) => String(e.status).toLowerCase() === "rejected",
    ).length;
    return {
      total: expenses.length,
      approved: approvedCount,
      rejected: rejectedCount,
    };
  }, [expenses]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-manrope font-bold text-2xl text-forest-900">
              Approved & Rejected Claims
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-50 text-forest-700 border border-forest-200">
              Audit Trail
            </span>
          </div>
          <p className="text-sm text-surface-500 mt-1">
            Review past approval decisions, audit timelines, and reviewer notes across your organization.
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-sm flex items-center justify-between shadow-sm animate-slide-down">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-medium">{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-amber-600 hover:text-amber-800 p-1.5 rounded-lg hover:bg-amber-100/50 transition-colors"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="ethereal-card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">
              Total Actioned
            </p>
            <p className="text-xl font-manrope font-bold text-forest-900">
              {stats.total}
            </p>
          </div>
        </div>

        <div className="ethereal-card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">
              Approved
            </p>
            <p className="text-xl font-manrope font-bold text-emerald-600">
              {stats.approved}
            </p>
          </div>
        </div>

        <div className="ethereal-card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wider">
              Rejected
            </p>
            <p className="text-xl font-manrope font-bold text-rose-600">
              {stats.rejected}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="ethereal-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto bg-surface-100/70 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-white text-forest-900 shadow-sm"
                : "text-surface-500 hover:text-forest-900"
            }`}
          >
            All Actioned ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("approved")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "approved"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-surface-500 hover:text-emerald-700"
            }`}
          >
            Approved ({stats.approved})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("rejected")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === "rejected"
                ? "bg-white text-rose-700 shadow-sm"
                : "text-surface-500 hover:text-rose-700"
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor, category, employee..."
            className="w-full bg-surface-50 rounded-xl pl-9 pr-4 py-2 text-xs text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter border border-surface-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="ethereal-card p-12 text-center text-sm text-surface-500">
          <div className="w-8 h-8 rounded-full border-2 border-forest-500 border-t-transparent animate-spin mx-auto mb-3" />
          Loading claim history...
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-200/80">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredExpenses.length === 0 && (
        <div className="ethereal-card text-center py-16 px-6 flex flex-col items-center justify-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-600 mb-4">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h3 className="font-manrope font-bold text-lg text-forest-900 mb-1">
            No actioned claims found
          </h3>
          <p className="text-surface-500 text-sm max-w-sm">
            {searchQuery || statusFilter !== "all"
              ? "No claims match your active filter or search criteria."
              : "No expenses have been approved or rejected yet. When reviewers take action on claims, their decisions and full timelines will appear here."}
          </p>
        </div>
      )}

      {/* Actioned Expense Cards */}
      {!loading && !error && filteredExpenses.length > 0 && (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => {
            const isExpanded = expandedId === expense.id;
            const isHighlighted = highlightedId === expense.id;
            const detail = detailCache[expense.id];
            const isApproved =
              String(expense.status).toLowerCase() === "approved";
            const amount = Number(
              expense.converted_amount || expense.amount || 0,
            );
            const currency =
              expense.base_currency || expense.currency || "USD";
            const originalAmount = Number(expense.amount || 0);
            const originalCurrency = expense.currency || "USD";
            const isDifferentCurrency =
              originalCurrency.toUpperCase() !== currency.toUpperCase();

            const catClass =
              CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.Other;

            return (
              <div
                key={expense.id}
                id={`history-card-${expense.id}`}
                className={`ethereal-card !p-0 overflow-hidden transition-all duration-300 ${
                  isHighlighted
                    ? "ring-2 ring-forest-500 bg-forest-50/40 border-forest-300 shadow-md"
                    : "hover:border-forest-200"
                }`}
              >
                {/* Header Row (Click to Expand) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(expense.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-50/80 transition-colors text-left"
                >
                  {/* Left: Submitter & Vendor Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {isApproved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-manrope font-bold text-sm text-forest-900 truncate">
                          {expense.vendor || expense.description || "Expense Claim"}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${catClass}`}
                        >
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500 truncate">
                        Submitted by{" "}
                        <span className="font-semibold text-forest-800">
                          {expense.employee_name || "Employee"}
                        </span>{" "}
                        • {formatDate(expense.submitted_at)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amounts & Status Badge */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-manrope font-bold text-base text-forest-900">
                        {currency}{" "}
                        {amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      {isDifferentCurrency && (
                        <p className="text-[11px] text-surface-400">
                          Orig: {originalCurrency}{" "}
                          {originalAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>

                    {/* Status Pill */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      <span>{isApproved ? "Approved" : "Rejected"}</span>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-surface-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-surface-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Decision Timeline */}
                {isExpanded && (
                  <div className="px-6 py-5 border-t border-surface-100 bg-surface-50/40 animate-fade-in">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-2">
                        <History className="w-4 h-4 text-forest-600" />
                        Approval Decision Audit Trail
                      </h4>
                      {expense.invoice_number && (
                        <span className="text-xs text-surface-500">
                          Invoice: <span className="font-mono">{expense.invoice_number}</span>
                        </span>
                      )}
                    </div>

                    {detailLoading && !detail && (
                      <div className="py-4 text-sm text-surface-500 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-forest-500 border-t-transparent animate-spin" />
                        Loading approval timeline...
                      </div>
                    )}

                    {detail?.error && (
                      <p className="text-sm text-red-600 py-2">{detail.error}</p>
                    )}

                    {detail && !detail.error && (
                      <div className="pt-2">
                        <ApprovalStepper
                          steps={toFullSteps(detail.timeline)}
                          variant="full"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
