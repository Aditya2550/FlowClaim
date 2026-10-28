import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { approveExpense, rejectExpense } from "../../../api/expenseService.js";
import { getPending } from "../../../api/approvalService.js";
import { useSocket } from "../../../hooks/useSocket.js";
import {
  CheckCircle2,
  X,
  Plane,
  Building,
  Monitor,
  Car,
  Sparkles,
  Filter,
} from "lucide-react";
import Button from "../../../components/ui/Button.jsx";
import RejectModal from "./RejectModal.jsx";

const MERCHANT_ICONS = {
  Plane: Plane,
  Building: Building,
  Monitor: Monitor,
  Car: Car,
};

export default function ApprovalQueue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [notice, setNotice] = useState("");

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await getPending();
      setItems(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load approval queue",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  useEffect(() => {
    if (loading) return;
    const targetExpenseId = searchParams.get("expense");
    if (!targetExpenseId) return;

    const matched = items.some((item) => item.id === targetExpenseId);
    if (matched) {
      setHighlightedId(targetExpenseId);
      setTimeout(() => {
        const el = document.getElementById(`expense-card-${targetExpenseId}`);
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
      // Instead of leaving the approver on an empty queue, automatically navigate to Approved / Rejected history tab!
      navigate(
        `/approval-history?expense=${targetExpenseId}&notice=actioned`,
        { replace: true },
      );
    }
  }, [loading, items, searchParams, setSearchParams, navigate]);

  useSocket({
    onApprovalUpdate: () => {
      loadPending();
    },
  });

  async function handleApprove(id) {
    setActionLoadingId(id);
    try {
      await approveExpense(id, { comment: "Approved via manager queue" });
      await loadPending();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to approve expense",
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReject(id, reason) {
    setActionLoadingId(id);
    try {
      await rejectExpense(id, { comment: reason });
      setRejectTarget(null);
      await loadPending();
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to reject expense",
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  function displayName(item) {
    return item.employee_name || item.employee?.name || "Employee";
  }

  function displayRole(item) {
    return item.employee_role || item.employee?.role || "employee";
  }

  function displayAmount(item) {
    const original = Number(item.amount || 0);
    const converted = Number(item.converted_amount || original);
    return {
      original,
      converted,
      sourceCurrency: item.currency || "USD",
      companyCurrency: item.base_currency || "USD",
    };
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-manrope font-bold text-lg text-forest-900">
          Pending Queue ({items.length})
        </h2>
        <button className="p-2.5 rounded-xl hover:bg-surface-100 transition-colors text-surface-400">
          <Filter className="w-4 h-4" />
        </button>
      </div>

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

      {/* Queue Items */}
      <div className="space-y-4">
        {loading && (
          <div className="ethereal-card text-center py-12">
            <p className="text-surface-400 text-sm">Loading pending items...</p>
          </div>
        )}

        {!loading && error && (
          <div className="ethereal-card text-center py-12">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          items.map((item) => {
            const MerchantIcon = MERCHANT_ICONS[item.merchantIcon] || Plane;
            const amounts = displayAmount(item);
            const riskColor =
              item.risk_level === "LOW"
                ? "text-emerald-500"
                : item.risk_level === "MEDIUM"
                  ? "text-amber-500"
                  : "text-red-500";

            const isHighlighted = highlightedId === item.id;

            return (
              <div
                key={item.id}
                id={`expense-card-${item.id}`}
                className={`relative bg-white rounded-3xl p-6 sm:p-8 border shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 transition-all duration-300 group animate-slide-up overflow-hidden ${
                  isHighlighted
                    ? "ring-2 ring-forest-500 bg-forest-50/40 border-forest-300"
                    : "border-surface-200"
                }`}
              >
                {/* Top Row: Employee + ID */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-500 to-emerald-600 shadow-md flex items-center justify-center text-white font-manrope font-bold text-sm ring-2 ring-white">
                      {displayName(item)
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-manrope font-bold text-sm text-forest-900">
                        {displayName(item)}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neon-700">
                        {displayRole(item)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-forest-700 bg-emerald-50 px-3 py-1.5 rounded-lg font-mono font-medium border border-emerald-100">
                    ID: #{String(item.id).slice(0, 8)}
                  </span>
                </div>

                {/* Merchant & Purpose */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-surface-500 mb-2">
                    Merchant & Purpose
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-surface-100">
                      <MerchantIcon className="w-5 h-5 text-forest-500" />
                    </div>
                    <p className="font-manrope font-semibold text-forest-900">
                      {item.vendor || "Expense"}
                    </p>
                  </div>
                </div>

                {/* Currency Display */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-surface-500 mb-1">
                      Original Currency
                    </p>
                    <p className="font-manrope font-bold text-2xl text-forest-900">
                      {amounts.sourceCurrency}{" "}
                      {amounts.original.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neon-700 mb-1">
                      Company Currency
                    </p>
                    <p className="font-manrope font-bold text-2xl text-forest-900">
                      {amounts.companyCurrency}{" "}
                      {amounts.converted.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                {/* AI Audit Note */}
                <div className="bg-gradient-to-r from-surface-50 to-white border border-surface-100 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-forest-500" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                      Risk Level
                    </p>
                  </div>
                  <p
                    className={`text-sm leading-relaxed font-semibold ${riskColor}`}
                  >
                    {item.risk_level || "LOW"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2 border-t border-surface-100 mt-2">
                  <button
                    onClick={() => setRejectTarget(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold rounded-xl px-6 py-3.5 hover:bg-red-100 hover:shadow-md transition-all text-sm active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <Button
                    onClick={() => handleApprove(item.id)}
                    loading={actionLoadingId === item.id}
                    className="flex-1 !py-3.5 shadow-[0_4px_15px_rgba(0,255,102,0.25)] hover:shadow-[0_6px_20px_rgba(0,255,102,0.3)] hover:scale-[1.02] transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Approve
                  </Button>
                </div>
              </div>
            );
          })}

        {!loading && !error && items.length === 0 && (
          <div className="ethereal-card text-center py-12">
            <p className="text-surface-400 text-sm">
              All caught up! No pending items.
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <RejectModal
        open={!!rejectTarget}
        expense={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onReject={(reason) => handleReject(rejectTarget?.id, reason)}
      />
    </div>
  );
}
