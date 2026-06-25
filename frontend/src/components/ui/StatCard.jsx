import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  variant = "default",
  className = "",
  children,
}) {
  const variantClasses = {
    default: "bg-white",
    forest: "bg-forest-500 text-white",
    neon: "bg-gradient-to-br from-forest-500 to-forest-700 text-white",
  };

  const trendColor =
    trend > 0 ? "text-emerald-500" : trend < 0 ? "text-red-400" : "text-surface-400";
  const TrendIcon =
    trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 ${variantClasses[variant]} ${className}`}
      style={{ boxShadow: "0 1px 3px rgba(26, 77, 46, 0.04)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            variant === "default" ? "text-surface-500" : "text-white/70"
          }`}
        >
          {title}
        </p>
        {Icon && (
          <div
            className={`p-2 rounded-xl ${
              variant === "default" ? "bg-surface-100" : "bg-white/10"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <p className="font-manrope font-bold text-3xl tracking-tight mb-2">
        {value}
      </p>

      {(trend !== undefined || trendLabel) && (
        <div className="flex items-center gap-1.5">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span
            className={`text-sm ${
              variant === "default" ? trendColor : "text-white/80"
            }`}
          >
            {trendLabel || `${trend > 0 ? "+" : ""}${trend}%`}
          </span>
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
