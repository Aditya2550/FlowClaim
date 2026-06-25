import { useEffect, useMemo, useState } from "react";
import ApprovalStepper from "../features/approval/components/ApprovalStepper.jsx";
import Button from "../components/ui/Button.jsx";
import { saveWorkflowRules } from "../api/approvalService.js";
import { getUsers } from "../api/userService.js";
import { Settings, Users, Sparkles, X } from "lucide-react";

const SUGGESTED_APPROVERS = [
  { id: 1, name: "Jordan D'Amico", role: "Head of Legal", initials: "JD" },
  { id: 2, name: "Elena Lopez", role: "Compliance Lead", initials: "EL" },
  { id: 3, name: "Raj Patel", role: "VP Engineering", initials: "RP" },
];

const WORKFLOW_STEPS = [
  {
    step: 1,
    role: "Initiation",
    name: "Employee submits ledger entry",
    status: "APPROVED",
  },
  {
    step: 2,
    role: "Direct Manager",
    name: "Supervisor review required",
    status: "CURRENT",
  },
  {
    step: 3,
    role: "Executive Consensus",
    name: "Requires 60% approval score",
    status: "PENDING",
  },
];

export default function AdminPanelPage() {
  const [managerFirst, setManagerFirst] = useState(true);
  const [threshold, setThreshold] = useState(60);
  const [selectedApprovers, setSelectedApprovers] = useState([
    { id: 1, name: "Sarah Miller (CFO)", initials: "SM" },
    { id: 2, name: "Marcus Vane (VP Ops)", initials: "MV" },
  ]);
  const [isDrafting, setIsDrafting] = useState(true);
  const [availableApprovers, setAvailableApprovers] =
    useState(SUGGESTED_APPROVERS);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;
    getUsers()
      .then((response) => {
        if (!active) return;
        const users = Array.isArray(response?.users) ? response.users : [];
        const mapped = users
          .filter((user) =>
            ["manager", "admin"].includes(
              String(user.role || "").toLowerCase(),
            ),
          )
          .map((user) => {
            const name = user.name || "Approver";
            const initials = name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            return {
              id: user.id,
              name,
              role: user.role,
              initials,
            };
          });
        if (mapped.length > 0) {
          setAvailableApprovers(mapped);
        }
      })
      .catch(() => {
        // Keep local suggestions when users endpoint is unavailable.
      });

    return () => {
      active = false;
    };
  }, []);

  const payloadApprovers = useMemo(
    () => selectedApprovers.map((person) => person.id),
    [selectedApprovers],
  );

  async function handleSaveWorkflow() {
    setSaveLoading(true);
    setSaveMessage("");
    setSaveError("");

    try {
      await saveWorkflowRules({
        mode: threshold > 50 ? "hybrid" : "sequential",
        percentage: threshold,
        approvers: payloadApprovers,
        managerFirstEnabled: managerFirst,
      });
      setSaveMessage("Workflow rules saved successfully.");
      setIsDrafting(false);
    } catch (err) {
      setSaveError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to save workflow rules",
      );
    } finally {
      setSaveLoading(false);
    }
  }

  function removeApprover(id) {
    setSelectedApprovers((prev) => prev.filter((a) => a.id !== id));
  }

  function addApprover(approver) {
    if (!selectedApprovers.find((a) => a.id === approver.id)) {
      setSelectedApprovers((prev) => [...prev, approver]);
    }
  }

  const thresholdLabel =
    threshold <= 50
      ? "MAJORITY"
      : threshold <= 75
        ? "SUPER MAJORITY"
        : "UNANIMOUS";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
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
          <div className="flex items-center gap-3">
            <Button loading={saveLoading} onClick={handleSaveWorkflow} size="sm">
              Save Rules
            </Button>
          </div>
        </div>
        {saveMessage && (
          <p className="text-sm text-emerald-600 mt-2">{saveMessage}</p>
        )}
        {saveError && <p className="text-sm text-red-600 mt-2">{saveError}</p>}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Global Approval Rules */}
          <div className="ethereal-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-manrope font-bold text-lg text-forest-900">
                  Global Approval Rules
                </h2>
                <p className="text-sm text-surface-500 mt-0.5">
                  Define the fundamental behavior of your reimbursement chain.
                </p>
              </div>
              {isDrafting && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600">
                  Drafting
                </span>
              )}
            </div>

            {/* Manager First Toggle */}
            <div className="bg-surface-50 rounded-xl p-5 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white">
                    <Settings className="w-5 h-5 text-forest-500" />
                  </div>
                  <div>
                    <p className="font-manrope font-semibold text-sm text-forest-900">
                      Require Direct Manager Approval First
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      Forces initial review by the submitter's immediate
                      supervisor.
                    </p>
                  </div>
                </div>
                {/* Toggle Switch */}
                <button
                  onClick={() => setManagerFirst(!managerFirst)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    managerFirst ? "bg-neon" : "bg-surface-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                      managerFirst ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Consensus Threshold */}
            <div className="bg-surface-50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-manrope font-semibold text-sm text-forest-900">
                    Consensus Threshold
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    Percentage of designated approvers required to finalize.
                  </p>
                </div>
                <p className="font-manrope font-bold text-3xl text-forest-900">
                  {threshold}
                  <span className="text-lg text-surface-500">%</span>
                </p>
              </div>

              {/* Slider */}
              <div className="relative mb-3">
                <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest-500 to-neon rounded-full transition-all duration-200"
                    style={{ width: `${threshold}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
                {/* Thumb indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neon border-4 border-white shadow pointer-events-none transition-all duration-200"
                  style={{ left: `calc(${threshold}% - 10px)` }}
                />
              </div>
              <div className="flex justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${threshold <= 50 ? "text-neon-700" : "text-surface-400"}`}
                >
                  Majority
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${threshold > 50 && threshold <= 75 ? "text-neon-700" : "text-surface-400"}`}
                >
                  Super Majority
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${threshold > 75 ? "text-neon-700" : "text-surface-400"}`}
                >
                  Unanimous
                </span>
              </div>
            </div>
          </div>

          {/* High-Level Approvers */}
          <div className="ethereal-card">
            <h2 className="font-manrope font-bold text-lg text-forest-900 mb-1">
              Specific High-Level Approvers
            </h2>
            <p className="text-sm text-surface-500 mb-5">
              Assign mandatory key stakeholders for transactions exceeding $5k.
            </p>

            {/* Selected Approvers */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedApprovers.map((approver) => (
                <div
                  key={approver.id}
                  className="flex items-center gap-2 bg-forest-500 text-white rounded-full pl-1.5 pr-3 py-1.5"
                >
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    {approver.initials}
                  </div>
                  <span className="text-sm font-medium">{approver.name}</span>
                  <button
                    onClick={() => removeApprover(approver.id)}
                    className="ml-1 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Input */}
            <input
              placeholder="Add stakeholder..."
              className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter mb-5"
            />

            {/* Quick Suggestions */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-surface-500 mb-3">
                Quick Suggestions
              </p>
              <div className="space-y-2">
                {availableApprovers.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => addApprover(person)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-manrope font-bold text-xs">
                      {person.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-forest-900">
                        {person.name}
                      </p>
                      <p className="text-xs text-surface-500">{person.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Workflow Preview */}
          <div className="ethereal-card">
            <h3 className="font-manrope font-bold text-sm text-forest-900 mb-5">
              Workflow Preview
            </h3>
            <ApprovalStepper steps={WORKFLOW_STEPS} />
          </div>

          {/* Latency Estimate */}
          <div className="ethereal-card">
            <p className="text-[10px] font-bold uppercase tracking-wider text-surface-500 mb-3">
              Estimated Processing
            </p>
            <div className="text-center">
              <p className="font-manrope font-bold text-forest-900">
                2.4 day average{" "}
                <span className="text-neon-700">turnaround</span> for approvals.
              </p>
              <p className="text-xs text-surface-500 mt-1">
                Based on current rule configuration
              </p>
            </div>
          </div>

          {/* Smart Tip */}
          <div className="bg-neon/5 rounded-2xl p-5 ghost-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-neon-700" />
              <p className="font-manrope font-bold text-sm text-forest-900">
                Smart Tip
              </p>
            </div>
            <p className="text-xs text-forest-700 leading-relaxed">
              Adding a 'Super Majority' rule for amounts over $50k increases
              security but adds 12h to processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
