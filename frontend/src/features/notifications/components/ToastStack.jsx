import { useState, useEffect, useRef } from "react";
import { X, Zap } from "lucide-react";

export default function ToastStack({ items = [], onDismiss }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fixed right-6 top-6 z-[60] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {items.slice(0, 3).map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);
  const dismissTimerRef = useRef(null);
  const exitTimerRef = useRef(null);

  useEffect(() => {
    // Start exit animation slightly before the 5s auto-dismiss threshold
    exitTimerRef.current = setTimeout(() => {
      setIsExiting(true);
    }, 4550);

    dismissTimerRef.current = setTimeout(() => {
      onDismiss?.(toast.id);
    }, 4950);

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [toast.id, onDismiss]);

  const handleManualDismiss = () => {
    if (isExiting) return;
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);

    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.(toast.id);
    }, 380);
  };

  const isExpenseSuccess = toast.type === "expense_success";

  return (
    <div
      className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl px-4.5 py-3.5 flex items-center gap-3.5 border border-forest-500/10 ${
        isExiting ? "animate-toast-slide-out" : "animate-toast-slide-in"
      }`}
      style={{
        boxShadow:
          "0 12px 32px -4px rgba(26, 77, 46, 0.12), 0 4px 12px rgba(26, 77, 46, 0.04)",
      }}
    >
      {isExpenseSuccess ? (
        <FlowClaimLogoAnimated />
      ) : (
        <div className="p-2 rounded-xl bg-neon-500/10 text-forest-600 border border-neon-500/20 flex-shrink-0">
          <Zap className="w-4 h-4" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] text-neon-700 font-bold uppercase tracking-wider">
            {isExpenseSuccess ? "Success" : toast.type || "Update"}
          </span>
        </div>
        <p className="text-sm font-medium text-forest-900 leading-snug truncate">
          {toast.title}
        </p>
      </div>

      <button
        onClick={handleManualDismiss}
        className="text-surface-400 hover:text-forest-700 hover:bg-forest-50/70 p-1.5 rounded-lg transition-all duration-150 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-neon-400/50"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      <ToastStyles />
    </div>
  );
}

function FlowClaimLogoAnimated() {
  return (
    <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
      {/* Neon Green Expanding Circular Ripple / Wave Effect */}
      <div
        className="absolute inset-0 rounded-full border-2 border-neon-400 bg-neon-400/15 pointer-events-none"
        style={{
          animation: "logoRipple 0.7s cubic-bezier(0.1, 0.8, 0.25, 1) 0.95s forwards",
          opacity: 0,
        }}
      />

      {/* SVG Animated Logo Container with Settle Bounce */}
      <div
        className="relative w-10 h-10 flex items-center justify-center"
        style={{
          animation: "logoBounce 0.52s cubic-bezier(0.25, 1, 0.5, 1) 0.95s forwards",
        }}
      >
        <svg viewBox="0 0 40 40" className="w-10 h-10 overflow-visible">
          {/* Forest Green Circle Draw */}
          <circle
            cx="20"
            cy="20"
            r="17"
            fill="none"
            stroke="#1A4D2E"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeDasharray="107"
            strokeDashoffset="107"
            style={{
              animation: "circleDraw 0.55s cubic-bezier(0.65, 0, 0.35, 1) forwards",
            }}
          />

          {/* Neon Green Checkmark Tick Draw */}
          <path
            d="M12 20.5 L17.5 26 L28.5 13.5"
            fill="none"
            stroke="#00FF66"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="26"
            strokeDashoffset="26"
            style={{
              animation: "tickDraw 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.25) 0.55s forwards",
              filter: "drop-shadow(0 0 2px rgba(0, 255, 102, 0.6))",
            }}
          />
        </svg>
      </div>
    </div>
  );
}

function ToastStyles() {
  return (
    <style>{`
      @keyframes circleDraw {
        0% {
          stroke-dashoffset: 107;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }

      @keyframes tickDraw {
        0% {
          stroke-dashoffset: 26;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }

      @keyframes logoBounce {
        0% {
          transform: translateY(0) scale(1, 1);
        }
        35% {
          transform: translateY(2.5px) scale(1.05, 0.95);
        }
        68% {
          transform: translateY(-1.5px) scale(0.98, 1.02);
        }
        100% {
          transform: translateY(0) scale(1, 1);
        }
      }

      @keyframes logoRipple {
        0% {
          transform: scale(1);
          opacity: 0.85;
          border-width: 2px;
        }
        50% {
          opacity: 0.45;
        }
        100% {
          transform: scale(2.0);
          opacity: 0;
          border-width: 1px;
        }
      }

      @keyframes toastSlideIn {
        0% {
          opacity: 0;
          transform: translateX(36px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }

      @keyframes toastSlideOut {
        0% {
          opacity: 1;
          transform: translateX(0) scale(1);
          max-height: 100px;
        }
        100% {
          opacity: 0;
          transform: translateX(48px) scale(0.92);
          max-height: 0px;
          margin-top: -12px;
        }
      }

      .animate-toast-slide-in {
        animation: toastSlideIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      .animate-toast-slide-out {
        animation: toastSlideOut 0.38s cubic-bezier(0.7, 0, 0.84, 0) forwards;
      }
    `}</style>
  );
}

