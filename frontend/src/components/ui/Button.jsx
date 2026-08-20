import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  primary: "btn-neon",
  secondary: "bg-surface-200 text-forest-700 hover:bg-surface-300 font-medium rounded-xl px-6 py-3 transition-colors duration-200",
  ghost: "bg-transparent text-forest-600 hover:bg-surface-100 font-medium rounded-xl px-6 py-3 transition-colors duration-200",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl px-6 py-3 transition-colors duration-200",
  outline: "bg-white text-forest-700 ghost-border hover:bg-surface-100 font-medium rounded-xl px-6 py-3 transition-colors duration-200",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  size = "md",
  ...props
}) {
  const sizeClasses = {
    sm: "!px-4 !py-2 text-sm",
    md: "",
    lg: "!px-8 !py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02,
        boxShadow: variant === "primary" 
          ? "0 0 25px rgba(0, 255, 102, 0.4)" 
          : "0 4px 12px rgba(26, 77, 46, 0.05)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className={`${variants[variant] || variants.primary} ${sizeClasses[size]} ${className} inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none`}
      disabled={disabled || loading}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading && (
          <motion.span
            initial={{ opacity: 0, width: 0, marginRight: 0 }}
            animate={{ opacity: 1, width: "auto", marginRight: 8 }}
            exit={{ opacity: 0, width: 0, marginRight: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            <Loader2 className="w-4 h-4 animate-spin text-current" />
          </motion.span>
        )}
      </AnimatePresence>
      {children}
    </motion.button>
  );
}

