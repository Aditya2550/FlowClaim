import { Loader2 } from "lucide-react";

const variants = {
  primary: "btn-neon",
  secondary: "bg-surface-200 text-forest-700 hover:bg-surface-300 font-medium rounded-xl px-6 py-3 transition-all duration-200",
  ghost: "bg-transparent text-forest-600 hover:bg-surface-100 font-medium rounded-xl px-6 py-3 transition-all duration-200",
  danger: "bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl px-6 py-3 transition-all duration-200",
  outline: "bg-white text-forest-700 ghost-border hover:bg-surface-100 font-medium rounded-xl px-6 py-3 transition-all duration-200",
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
    <button
      className={`${variants[variant] || variants.primary} ${sizeClasses[size]} ${className} inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
