import { CheckCircle2, Circle, XCircle, Loader2 } from "lucide-react";

const STEP_STATUS = {
  APPROVED: { icon: CheckCircle2, color: "bg-neon", lineColor: "bg-neon", textColor: "text-forest-600" },
  CURRENT: { icon: Loader2, color: "bg-neon/20 ring-2 ring-neon", lineColor: "bg-surface-300", textColor: "text-forest-900" },
  REJECTED: { icon: XCircle, color: "bg-red-100", lineColor: "bg-red-200", textColor: "text-red-600" },
  PENDING: { icon: Circle, color: "bg-surface-200", lineColor: "bg-surface-200", textColor: "text-surface-400" },
};

export default function ApprovalStepper({ steps = [], variant = "full", className = "" }) {
  if (variant === "mini") {
    return <MiniStepper steps={steps} className={className} />;
  }

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {steps.map((step, index) => {
        const config = STEP_STATUS[step.status] || STEP_STATUS.PENDING;
        const Icon = config.icon;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.step || index} className="flex items-start gap-4">
            {/* Step indicator column */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${config.color}`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    step.status === "APPROVED"
                      ? "text-forest-900"
                      : step.status === "CURRENT"
                      ? "text-neon-700 animate-spin"
                      : step.status === "REJECTED"
                      ? "text-red-500"
                      : "text-surface-400"
                  }`}
                />
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 h-12 transition-all duration-500 ${config.lineColor}`}
                />
              )}
            </div>

            {/* Step content */}
            <div className="pt-1.5 pb-6">
              <p className={`text-sm font-semibold font-manrope ${config.textColor}`}>
                Step {step.step || index + 1}: {step.role}
              </p>
              {step.name && (
                <p className="text-xs text-surface-500 mt-0.5">{step.name}</p>
              )}
              {step.description && (
                <p className="text-xs text-surface-400 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniStepper({ steps = [], className = "" }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const dotColor =
          step.status === "APPROVED"
            ? "bg-neon"
            : step.status === "CURRENT"
            ? "bg-neon animate-pulse-slow"
            : step.status === "REJECTED"
            ? "bg-red-400"
            : "bg-surface-300";
        const lineColor =
          step.status === "APPROVED"
            ? "bg-neon"
            : step.status === "REJECTED"
            ? "bg-red-300"
            : "bg-surface-300";

        return (
          <div key={step.step || index} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${dotColor}`} />
            {!isLast && (
              <div className={`w-6 h-0.5 rounded-full transition-all duration-500 ${lineColor}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
