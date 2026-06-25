export default function ManagerFirstNode({ enabled = true }) {
  return (
    <div className="bg-surface-50 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="font-manrope font-semibold text-sm text-forest-900">
          Priority Route
        </p>
        <p className="text-xs text-surface-500 mt-0.5">
          Manager-First gate is {enabled ? "active" : "inactive"}
        </p>
      </div>
      <div
        className={`w-3 h-3 rounded-full ${
          enabled ? "bg-neon animate-pulse-slow" : "bg-surface-300"
        }`}
      />
    </div>
  );
}
