import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current && onClose) {
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(10, 37, 21, 0.4)", backdropFilter: "blur(8px)" }}
    >
      <div className={`bg-white rounded-2xl w-full ${sizeClasses[size]} animate-scale-in`} style={{ boxShadow: "0 8px 32px rgba(26, 77, 46, 0.12)" }}>
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h3 className="font-manrope font-bold text-lg text-forest-900">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface-100 transition-colors text-surface-500"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="px-6 pb-6 pt-2">{children}</div>
      </div>
    </div>
  );
}
