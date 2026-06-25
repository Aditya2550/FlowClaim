import { Clock, CheckCircle2, XCircle, Eye } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "badge-pending",
    icon: Clock,
  },
  PENDING_MANAGER: {
    label: "Pending Manager",
    className: "badge-pending",
    icon: Clock,
  },
  IN_FINANCE: {
    label: "In Finance",
    className: "badge-review",
    icon: Eye,
  },
  IN_REVIEW: {
    label: "In Review",
    className: "badge-review",
    icon: Eye,
  },
  CURRENT: {
    label: "In Review",
    className: "badge-review",
    icon: Eye,
  },
  APPROVED: {
    label: "Approved",
    className: "badge-approved",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className: "badge-rejected",
    icon: XCircle,
  },
};

export default function StatusBadge({ status, size = "sm" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-lg ${config.className} ${sizeClasses[size]} uppercase tracking-wide`}
    >
      <Icon className={size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {config.label}
    </span>
  );
}
