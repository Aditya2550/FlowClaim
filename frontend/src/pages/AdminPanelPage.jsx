import { useEffect, useMemo, useState } from "react";
import ApprovalStepper from "../features/approval/components/ApprovalStepper.jsx";
import Button from "../components/ui/Button.jsx";
import { getApprovalRules, saveApprovalRules } from "../api/approvalService.js";
import { ListOrdered, Percent, GitBranch, X, Plus } from "lucide-react";

const ROLE_OPTIONS = ["manager", "finance", "director", "cfo"];

const RULE_TYPES = [
  {
    type: "sequential",
    label: "Sequential",
    icon: ListOrdered,
    desc: "Each role approves in order, one after another.",
  },
  {
    type: "percentage",
    label: "Percentage",
    icon: Percent,
    desc: "All users of one role vote; a % threshold decides.",
  },
  {
    type: "hybrid",
    label: "Hybrid",
    icon: GitBranch,
    desc: "High-value expenses skip to an override approver.",
  },
];

export default function AdminPanelPage() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [ruleType, setRuleType] = useState("sequential");

  // sequential
  const [sequentialRoles, setSequentialRoles] = useState(["manager", "finance"]);
  const [roleToAdd, setRoleToAdd] = useState(ROLE_OPTIONS[0]);

  // percentage
  const [pctRole, setPctRole] = useState("manager");
  const [pctThreshold, setPctThreshold] = useState(60);

  // hybrid
  const [overrideRole, setOverrideRole] = useState("cfo");
  const [overrideThreshold, setOverrideThreshold] = useState(10000);
  const [defaultFlow, setDefaultFlow] = useState(["manager", "finance"]);
  const [hybridRoleToAdd, setHybridRoleToAdd] = useState(ROLE_OPTIONS[0]);

  useEffect(() => {
    let active = true;
    getApprovalRules()
      .then((rule) => {
        if (!active || !rule) return;
        setRuleType(rule.type);
        const cfg = rule.config || {};
        if (rule.type === "sequential") {
          setSequentialRoles(cfg.roles || cfg.sequence || ["manager", "finance"]);
        } else if (rule.type === "percentage") {
          setPctRole(cfg.approverRole || "manager");
          setPctThreshold(cfg.threshold ?? 60);
        } else if (rule.type === "hybrid") {
          setOverrideRole(cfg.overrideRole || "cfo");
          setOverrideThreshold(cfg.overrideThreshold ?? 10000);
          setDefaultFlow(cfg.defaultFlow || ["manager", "finance"]);
        }
      })
      .catch(() => {
        // no rule yet — keep defaults, this is a first-time setup
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  function addSequentialRole() {
    if (!sequentialRoles.includes(roleToAdd)) {
      setSequentialRoles((prev) => [...prev, roleToAdd]);
    }
  }
  function removeSequentialRole(role) {
    setSequentialRoles((prev) => prev.filter((r) => r !== role));
  }

  function addHybridFlowRole() {
    if (!defaultFlow.includes(hybridRoleToAdd)) {
      setDefaultFlow((prev) => [...prev, hybridRoleToAdd]);
    }
  }
  function removeHybridFlowRole(role) {
    setDefaultFlow((prev) => prev.filter((r) => r !== role));
  }

  const payload = useMemo(() => {
    if (ruleType === "sequential") {
      return { type: "sequential", config: { roles: sequentialRoles } };
    }
    if (ruleType === "percentage") {
      return {
        type: "percentage",
        config: { approverRole: pctRole, threshold: Number(pctThreshold) },
      };
    }
    return {
      type: "hybrid",
      config: {
        overrideRole,
        overrideThreshold: Number(overrideThreshold),
        defaultFlow,
      },
    };
  }, [
    ruleType,
    sequentialRoles,
    pctRole,
    pctThreshold,
    overrideRole,
    overrideThreshold,
    defaultFlow,
  ]);

  const previewSteps = useMemo(() => {
    if (ruleType === "sequential") {
      return sequentialRoles.map((role, i) => ({
        step: i + 1,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        status: "PENDING",
      }));
    }
    if (ruleType === "hybrid") {
      return defaultFlow.map((role, i) => ({
        step: i + 1,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        status: "PENDING",
      }));
    }
    return [];
  }, [ruleType, sequentialRoles, defaultFlow]);

  async function handleSave() {
    setSaveLoading(true);
    setSaveMessage("");
    setSaveError("");
    try {
      if (ruleType === "sequential" && sequentialRoles.length === 0) {
        throw new Error("Add at least one approver role");
      }
      await saveApprovalRules(payload);
      setSaveMessage("Approval rule saved successfully.");
    } catch (err) {
      setSaveError(
        err?.response?.data?.message || err.message || "Failed to save rule",
      );
    } finally {
      setSaveLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-surface-500 text-sm">Loading current rule...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-surface-500 mb-1">
          <span className="text-surface-400">Workflow Builder</span>
          {" / "}
          <span className="text-neon-700">Expense Approvals</span>
        </p>
        <div className="flex items-center justify-between">
          <h1 className="font-manrope font-bold text-2xl text-forest-900">
            Approval Logic
          </h1>
          <Button loading={saveLoading} onClick={handleSave} size="sm">
            Save Rule
          </Button>
        </div>
        {saveMessage && <p className="text-sm text-emerald-600 mt-2">{saveMessage}</p>}
        {saveError && <p className="text-sm text-red-600 mt-2">{saveError}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Rule type picker */}
          <div className="ethereal-card">
            <h2 className="font-manrope font-bold text-lg text-forest-900 mb-1">
              Approval Rule Type
            </h2>
            <p className="text-sm text-surface-500 mb-5">
              Choose how expenses get routed for approval.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RULE_TYPES.map(({ type, label, icon: Icon, desc }) => (
                <button
                  key={type}
                  onClick={() => setRuleType(type)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    ruleType === type
                      ? "border-neon bg-neon/5"
                      : "border-surface-200 hover:border-surface-300"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-2 ${
                      ruleType === type ? "text-neon-700" : "text-surface-400"
                    }`}
                  />
                  <p className="font-manrope font-semibold text-sm text-forest-900">
                    {label}
                  </p>
                  <p className="text-xs text-surface-500 mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sequential config */}
          {ruleType === "sequential" && (
            <div className="ethereal-card">
              <h2 className="font-manrope font-bold text-lg text-forest-900 mb-1">
                Approval Chain
              </h2>
              <p className="text-sm text-surface-500 mb-5">
                Roles approve in this exact order.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {sequentialRoles.map((role, i) => (
                  <div
                    key={role}
                    className="flex items-center gap-2 bg-forest-500 text-white rounded-full pl-3 pr-2 py-1.5"
                  >
                    <span className="text-xs font-bold">{i + 1}</span>
                    <span className="text-sm font-medium capitalize">{role}</span>
                    <button
                      onClick={() => removeSequentialRole(role)}
                      className="ml-1 text-white/60 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {sequentialRoles.length === 0 && (
                  <p className="text-sm text-surface-400">No roles added yet.</p>
                )}
              </div>

              <div className="flex gap-2">
                <select
                  value={roleToAdd}
                  onChange={(e) => setRoleToAdd(e.target.value)}
                  className="bg-surface-50 rounded-xl px-4 py-2.5 text-sm capitalize outline-none"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <Button variant="secondary" size="sm" onClick={addSequentialRole}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>
            </div>
          )}

          {/* Percentage config */}
          {ruleType === "percentage" && (
            <div className="ethereal-card">
              <h2 className="font-manrope font-bold text-lg text-forest-900 mb-1">
                Voting Rule
              </h2>
              <p className="text-sm text-surface-500 mb-5">
                All users with the selected role vote in parallel.
              </p>

              <div className="bg-surface-50 rounded-xl p-5 mb-5">
                <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-2">
                  Approver Role
                </label>
                <select
                  value={pctRole}
                  onChange={(e) => setPctRole(e.target.value)}
                  className="w-full bg-white rounded-xl px-4 py-2.5 text-sm capitalize outline-none"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-surface-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-surface-500">
                    Approval Threshold
                  </label>
                  <p className="font-manrope font-bold text-2xl text-forest-900">
                    {pctThreshold}%
                  </p>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={pctThreshold}
                  onChange={(e) => setPctThreshold(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Hybrid config */}
          {ruleType === "hybrid" && (
            <div className="ethereal-card">
              <h2 className="font-manrope font-bold text-lg text-forest-900 mb-1">
                Hybrid Rule
              </h2>
              <p className="text-sm text-surface-500 mb-5">
                Expenses above the threshold go straight to the override
                approver. Below it, they follow the default chain.
              </p>

              <div className="bg-surface-50 rounded-xl p-5 mb-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-2">
                      Override Role
                    </label>
                    <select
                      value={overrideRole}
                      onChange={(e) => setOverrideRole(e.target.value)}
                      className="w-full bg-white rounded-xl px-4 py-2.5 text-sm capitalize outline-none"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-2">
                      Threshold Amount
                    </label>
                    <input
                      type="number"
                      value={overrideThreshold}
                      onChange={(e) => setOverrideThreshold(e.target.value)}
                      className="w-full bg-white rounded-xl px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-surface-50 rounded-xl p-5">
                <label className="text-xs font-bold uppercase tracking-wider text-surface-500 block mb-3">
                  Default Flow (below threshold)
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {defaultFlow.map((role, i) => (
                    <div
                      key={role}
                      className="flex items-center gap-2 bg-forest-500 text-white rounded-full pl-3 pr-2 py-1.5"
                    >
                      <span className="text-xs font-bold">{i + 1}</span>
                      <span className="text-sm font-medium capitalize">{role}</span>
                      <button
                        onClick={() => removeHybridFlowRole(role)}
                        className="ml-1 text-white/60 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={hybridRoleToAdd}
                    onChange={(e) => setHybridRoleToAdd(e.target.value)}
                    className="bg-white rounded-xl px-4 py-2.5 text-sm capitalize outline-none"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <Button variant="secondary" size="sm" onClick={addHybridFlowRole}>
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - preview */}
        <div className="space-y-4">
          <div className="ethereal-card">
            <h3 className="font-manrope font-bold text-sm text-forest-900 mb-5">
              Live Preview
            </h3>

            {ruleType === "percentage" ? (
              <div className="text-center py-4">
                <p className="font-manrope font-bold text-forest-900 capitalize">
                  All {pctRole}s vote
                </p>
                <p className="text-sm text-surface-500 mt-1">
                  {pctThreshold}% approval required to pass
                </p>
              </div>
            ) : (
              <ApprovalStepper steps={previewSteps} />
            )}

            {ruleType === "hybrid" && (
              <p className="text-xs text-surface-500 mt-4 pt-4 border-t border-surface-200">
                Expenses ≥ ₹{Number(overrideThreshold).toLocaleString()} skip
                directly to <span className="capitalize font-semibold">{overrideRole}</span>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}