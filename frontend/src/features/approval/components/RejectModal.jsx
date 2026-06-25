import { useState } from "react";
import Modal from "../../../components/ui/Modal.jsx";
import Button from "../../../components/ui/Button.jsx";
import { AlertTriangle } from "lucide-react";

export default function RejectModal({ open, expense, onClose, onReject }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function handleReject() {
    if (!reason.trim()) {
      setError("A rejection reason is required");
      return;
    }
    onReject(reason);
    setReason("");
    setError("");
  }

  function handleClose() {
    setReason("");
    setError("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Reject Expense" size="sm">
      <div className="space-y-5">
        {/* Warning */}
        <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              This action cannot be undone
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              The employee will be notified with your reason.
            </p>
          </div>
        </div>

        {/* Expense Info */}
        {expense && (
          <div className="bg-surface-50 rounded-xl p-4">
            <p className="text-xs text-surface-500 font-semibold uppercase tracking-wider mb-1">
              Rejecting
            </p>
            <p className="font-manrope font-bold text-sm text-forest-900">
              {expense.vendor || expense.merchant || "Expense"} —{" "}
              {expense.employee?.name || expense.employee_name || "Employee"}
            </p>
            <p className="text-xs text-surface-500 mt-0.5">
              {expense.base_currency || expense.currency || "USD"}{" "}
              {Number(expense.converted_amount || expense.amount || 0).toFixed(
                2,
              )}
            </p>
          </div>
        )}

        {/* Reason Input */}
        <div>
          <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
            Rejection Reason <span className="text-red-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Please explain why this expense is being rejected..."
            rows={4}
            className={`w-full bg-surface-50 rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-surface-400 outline-none transition-all font-inter resize-none ${
              error ? "ring-2 ring-red-300" : "focus:ring-2 focus:ring-neon/30"
            }`}
          />
          {error && (
            <p className="text-xs text-red-500 mt-1.5 animate-slide-down">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject} className="flex-1">
            Confirm Rejection
          </Button>
        </div>
      </div>
    </Modal>
  );
}
