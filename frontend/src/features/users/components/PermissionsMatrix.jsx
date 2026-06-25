import { usePermissions } from "../../../hooks/usePermissions.js";
import { Shield, Eye, Users } from "lucide-react";

const PERMISSIONS = [
  { key: "canOverrideApprovals", label: "Override Approvals", icon: Shield, description: "Can override any approval decision" },
  { key: "canViewAllExpenses", label: "View All Expenses", icon: Eye, description: "Can view expenses across all teams" },
  { key: "canSwitchRoles", label: "Switch Roles", icon: Users, description: "Can assume any role for testing" },
];

export default function PermissionsMatrix() {
  const admin = usePermissions("ADMIN");

  return (
    <div className="ethereal-card">
      <h3 className="font-manrope font-bold text-lg text-forest-900 mb-1">
        Permissions Matrix
      </h3>
      <p className="text-xs text-surface-500 mb-5">
        Admin role capabilities
      </p>

      <div className="space-y-3">
        {PERMISSIONS.map(({ key, label, icon: Icon, description }) => (
          <div key={key} className="flex items-center justify-between bg-surface-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white">
                <Icon className="w-4 h-4 text-forest-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-forest-900">{label}</p>
                <p className="text-xs text-surface-500">{description}</p>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                admin[key] ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
              }`}
            >
              {admin[key] ? "Enabled" : "Disabled"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
