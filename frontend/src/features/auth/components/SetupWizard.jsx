import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import Button from "../../components/ui/Button.jsx";
import { Building2, Loader2 } from "lucide-react";

export default function SetupWizard() {
  const { signup } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function startSetup() {
    setLoading(true);
    try {
      await signup({
        companyName: "My Company",
        countryCode: "IN",
        adminName: "First Admin",
        adminEmail: "admin@company.com",
        adminPassword: "Admin@123",
      });
      setDone(true);
    } catch {
      // Demo mode fallback handled in context
      setDone(true);
    }
    setLoading(false);
  }

  return (
    <div className="ethereal-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-neon/10">
          <Building2 className="w-5 h-5 text-forest-500" />
        </div>
        <div>
          <h3 className="font-manrope font-bold text-sm text-forest-900">Setup Wizard</h3>
          <p className="text-xs text-surface-500">Auto-provisions company and admin profile</p>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-forest-500 to-neon rounded-full transition-all duration-1000"
          style={{ width: loading ? "70%" : done ? "100%" : "0%" }}
        />
      </div>

      <Button
        onClick={startSetup}
        loading={loading}
        disabled={done}
        variant={done ? "secondary" : "primary"}
        className="w-full"
        size="sm"
      >
        {done ? "Setup Complete ✓" : "Start Auto-Setup"}
      </Button>
    </div>
  );
}
