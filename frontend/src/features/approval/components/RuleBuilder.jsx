import { useState } from "react";
import apiClient from "../../../services/apiClient.js";
import ApprovalStepper from "./ApprovalStepper.jsx";
import Button from "../../../components/ui/Button.jsx";

const WORKFLOW_PREVIEW = [
  { step: 1, role: "Manager", name: "Direct supervisor", status: "APPROVED" },
  { step: 2, role: "Finance", name: "Finance review", status: "CURRENT" },
  { step: 3, role: "CFO", name: "Final approval", status: "PENDING" },
];

export default function RuleBuilder() {
  const [mode, setMode] = useState("PERCENTAGE");
  const [percentage, setPercentage] = useState(50);
  const [managerFirstEnabled, setManagerFirstEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await apiClient.put("/workflows/rules", {
        mode,
        percentage,
        approvers: [2, 3],
        managerFirstEnabled,
      });
    } catch {
      // Demo mode
    }
    setSaving(false);
  }

  const modes = [
    { key: "PERCENTAGE", label: "Percentage" },
    { key: "SPECIFIC_APPROVER", label: "Approver" },
    { key: "HYBRID", label: "Hybrid" },
  ];

  return (
    <div className="ethereal-card">
      <h3 className="font-manrope font-bold text-lg text-forest-900 mb-1">
        Visual Rule Canvas
      </h3>
      <p className="text-xs text-surface-500 mb-5">
        Configure approval routing logic
      </p>

      {/* Manager First Toggle */}
      <div className="flex items-center justify-between bg-surface-50 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-forest-900 cursor-pointer">
            Priority Route (Manager-First)
          </label>
        </div>
        <button
          onClick={() => setManagerFirstEnabled(!managerFirstEnabled)}
          className={`relative w-12 h-6 rounded-full transition-all ${
            managerFirstEnabled ? "bg-neon" : "bg-surface-300"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              managerFirstEnabled ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-5">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === m.key
                ? "bg-forest-500 text-white"
                : "bg-surface-50 text-surface-500 hover:bg-surface-100"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Percentage Slider */}
      {mode !== "SPECIFIC_APPROVER" && (
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-surface-500 font-medium">Threshold</span>
            <span className="font-manrope font-bold text-lg text-forest-900">{percentage}%</span>
          </div>
          <div className="relative">
            <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-forest-500 to-neon rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      )}

      <Button onClick={save} loading={saving}>
        Save Rule
      </Button>
    </div>
  );
}
