import { X, Zap } from "lucide-react";

export default function ToastStack({ items = [], onDismiss }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fixed right-6 top-6 z-[60] flex flex-col gap-3 max-w-sm">
      {items.slice(0, 3).map((toast) => (
        <div
          key={toast.id}
          className="bg-white rounded-2xl px-5 py-4 flex items-start gap-3 animate-slide-in-right"
          style={{ boxShadow: "0 8px 32px rgba(26, 77, 46, 0.12)" }}
        >
          <div className="p-2 rounded-xl bg-neon-50 text-forest-500 flex-shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-neon-700 font-bold uppercase tracking-wider mb-0.5">
              {toast.type || "Update"}
            </p>
            <p className="text-sm text-forest-900">{toast.title}</p>
          </div>
          <button
            onClick={() => onDismiss?.(toast.id)}
            className="text-surface-400 hover:text-forest-600 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}