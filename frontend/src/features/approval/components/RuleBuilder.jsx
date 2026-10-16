import { useState, useEffect } from "react";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import apiClient from "../../../services/apiClient.js";
import { useNotifications } from "../../../context/NotificationContext.jsx";
import ApprovalStepper from "./ApprovalStepper.jsx";
import Button from "../../../components/ui/Button.jsx";

const WORKFLOW_PREVIEW = [
  { step: 1, role: "Manager", name: "Direct supervisor", status: "APPROVED" },
  { step: 2, role: "Finance", name: "Finance review", status: "CURRENT" },
  { step: 3, role: "CFO", name: "Final approval", status: "PENDING" },
];

const APPROVER_ROLES = ["manager", "finance", "director", "cfo", "admin"];

const MODES = [
  { key: "sequential", label: "Sequential" },
  { key: "percentage", label: "Percentage" },
  { key: "hybrid", label: "Hybrid" },
];

function moveRole(list, setList, index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= list.length) return;
  const updated = [...list];
  const [removed] = updated.splice(index, 1);
  updated.splice(targetIndex, 0, removed);
  setList(updated);
}

function removeRole(list, setList, index) {
  if (list.length <= 1) return;
  setList(list.filter((_, i) => i !== index));
}

function addRole(list, setList, role) {
  if (!role) return;
  setList([...list, role]);
}

export default function RuleBuilder() {
  const [mode, setMode] = useState("sequential");

  // sequential state (default: ["manager", "finance"])
  const [sequentialRoles, setSequentialRoles] = useState(["manager", "finance"]);
  const [selectedSeqRole, setSelectedSeqRole] = useState("manager");

  // percentage state (default: approverRole "manager", threshold 60)
  const [pctRole, setPctRole] = useState("manager");
  const [pctThreshold, setPctThreshold] = useState(60);

  // hybrid state (default: overrideRole "director", overrideThreshold 10000, defaultFlow ["manager", "finance"])
  const [overrideRole, setOverrideRole] = useState("director");
  const [overrideThreshold, setOverrideThreshold] = useState(10000);
  const [defaultFlow, setDefaultFlow] = useState(["manager", "finance"]);
  const [selectedHybridRole, setSelectedHybridRole] = useState("manager");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const { push } = useNotifications();

  useEffect(() => {
    let active = true;
    apiClient
      .get("/approval-rules")
      .then((res) => {
        if (!active || !res?.data) return;
        const rule = res.data;
        const ruleType = String(rule.type || "").toLowerCase();
        const cfg = rule.config || {};

        if (ruleType === "sequential") {
          setMode("sequential");
          const roles = Array.isArray(cfg.roles)
            ? cfg.roles
            : Array.isArray(cfg.sequence)
              ? cfg.sequence
              : ["manager", "finance"];
          setSequentialRoles(roles);
        } else if (ruleType === "percentage") {
          setMode("percentage");
          if (cfg.approverRole) setPctRole(cfg.approverRole);
          if (cfg.threshold !== undefined) setPctThreshold(Number(cfg.threshold));
        } else if (ruleType === "hybrid") {
          setMode("hybrid");
          if (cfg.overrideRole) setOverrideRole(cfg.overrideRole);
          if (cfg.overrideThreshold !== undefined)
            setOverrideThreshold(Number(cfg.overrideThreshold));
          if (Array.isArray(cfg.defaultFlow) && cfg.defaultFlow.length > 0) {
            setDefaultFlow(cfg.defaultFlow);
          }
        }
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          console.error("Failed to load current approval rule:", err);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    let payloadConfig = {};
    if (mode === "sequential") {
      if (sequentialRoles.length === 0) {
        setSaveError("At least one approver role is required");
        setSaving(false);
        return;
      }
      payloadConfig = { roles: sequentialRoles };
    } else if (mode === "percentage") {
      payloadConfig = {
        approverRole: pctRole,
        threshold: Number(pctThreshold),
      };
    } else if (mode === "hybrid") {
      if (defaultFlow.length === 0) {
        setSaveError("At least one default flow role is required");
        setSaving(false);
        return;
      }
      payloadConfig = {
        overrideRole,
        overrideThreshold: Number(overrideThreshold),
        defaultFlow,
      };
    }

    try {
      await apiClient.put("/approval-rules", {
        type: mode,
        config: payloadConfig,
      });
      setSaveMessage("Approval rule saved successfully.");
      push?.({
        type: "rule_success",
        title: "Approval rule saved successfully",
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save rule";
      setSaveError(msg);
      push?.({
        type: "error",
        title: msg,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ethereal-card">
      <h3 className="font-manrope font-bold text-lg text-forest-900 mb-1">
        Visual Rule Canvas
      </h3>
      <p className="text-xs text-surface-500 mb-5">
        Configure approval routing logic
      </p>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-5">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
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

      {/* Sequential Mode Inputs */}
      {mode === "sequential" && (
        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-2">
            Approval Chain (Ordered)
          </label>
          <div className="space-y-2 mb-3">
            {sequentialRoles.map((role, idx) => (
              <div
                key={`${role}-${idx}`}
                className="flex items-center justify-between bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-forest-500 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-forest-900 capitalize">{role}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveRole(sequentialRoles, setSequentialRoles, idx, -1)}
                    className="p-1 text-surface-500 hover:text-forest-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sequentialRoles.length - 1}
                    onClick={() => moveRole(sequentialRoles, setSequentialRoles, idx, 1)}
                    className="p-1 text-surface-500 hover:text-forest-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={sequentialRoles.length <= 1}
                    onClick={() => removeRole(sequentialRoles, setSequentialRoles, idx)}
                    className="p-1 text-surface-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed ml-1"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={selectedSeqRole}
              onChange={(e) => setSelectedSeqRole(e.target.value)}
              className="flex-1 bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm capitalize outline-none"
            >
              {APPROVER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => addRole(sequentialRoles, setSequentialRoles, selectedSeqRole)}
            >
              <Plus className="w-4 h-4 mr-1 inline" /> Add Role
            </Button>
          </div>
        </div>
      )}

      {/* Percentage Mode Inputs */}
      {mode === "percentage" && (
        <div className="mb-5">
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-2">
              Approver Role
            </label>
            <select
              value={pctRole}
              onChange={(e) => setPctRole(e.target.value)}
              className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 text-sm capitalize outline-none"
            >
              {APPROVER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-surface-500 font-medium">Approval Threshold</span>
              <span className="font-manrope font-bold text-lg text-forest-900">{pctThreshold}%</span>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-forest-500 to-neon rounded-full transition-all"
                  style={{ width: `${pctThreshold}%` }}
                />
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={pctThreshold}
                onChange={(e) => setPctThreshold(Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hybrid Mode Inputs */}
      {mode === "hybrid" && (
        <div className="mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-1.5">
                Override Role
              </label>
              <select
                value={overrideRole}
                onChange={(e) => setOverrideRole(e.target.value)}
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm capitalize outline-none"
              >
                {APPROVER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-1.5">
                Override Threshold
              </label>
              <input
                type="number"
                min="1"
                value={overrideThreshold}
                onChange={(e) => setOverrideThreshold(Number(e.target.value))}
                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-2">
              Default Flow (Ordered)
            </label>
            <div className="space-y-2 mb-3">
              {defaultFlow.map((role, idx) => (
                <div
                  key={`${role}-${idx}`}
                  className="flex items-center justify-between bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-forest-500 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-forest-900 capitalize">{role}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveRole(defaultFlow, setDefaultFlow, idx, -1)}
                      className="p-1 text-surface-500 hover:text-forest-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === defaultFlow.length - 1}
                      onClick={() => moveRole(defaultFlow, setDefaultFlow, idx, 1)}
                      className="p-1 text-surface-500 hover:text-forest-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={defaultFlow.length <= 1}
                      onClick={() => removeRole(defaultFlow, setDefaultFlow, idx)}
                      className="p-1 text-surface-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed ml-1"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={selectedHybridRole}
                onChange={(e) => setSelectedHybridRole(e.target.value)}
                className="flex-1 bg-surface-50 border border-surface-200 rounded-xl px-3 py-2 text-sm capitalize outline-none"
              >
                {APPROVER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => addRole(defaultFlow, setDefaultFlow, selectedHybridRole)}
              >
                <Plus className="w-4 h-4 mr-1 inline" /> Add Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {saveMessage && (
        <p className="text-sm font-medium text-emerald-600 mb-3">{saveMessage}</p>
      )}
      {saveError && (
        <p className="text-sm font-medium text-red-600 mb-3">{saveError}</p>
      )}

      <Button onClick={save} loading={saving}>
        Save Rule
      </Button>
    </div>
  );
}
