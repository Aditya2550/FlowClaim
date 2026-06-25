import { useCallback, useEffect, useState } from "react";
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

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

            return (
              <div key={item.id} className="ethereal-card animate-slide-up">
                {/* Top Row: Employee + ID */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-forest-500 flex items-center justify-center text-white font-manrope font-bold text-sm">
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
                  <span className="text-xs text-surface-500 bg-surface-100 px-3 py-1.5 rounded-lg font-mono">
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
                <div className="bg-surface-50 rounded-xl p-4 mb-5">
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
                <div className="flex gap-3">
                  <button
                    onClick={() => setRejectTarget(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-surface-100 text-forest-700 font-medium rounded-xl px-6 py-3 hover:bg-surface-200 transition-all text-sm"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <Button
                    onClick={() => handleApprove(item.id)}
                    loading={actionLoadingId === item.id}
                    className="flex-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
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
