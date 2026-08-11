import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import { ArrowRight, Building2, User, Mail, Lock } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function SignupPage() {
  const { signup, isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    countryCode: "US",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const role = String(user?.role || "").toLowerCase();
    if (role === "admin") navigate("/admin", { replace: true });
    else if (role === "manager") navigate("/manager", { replace: true });
    else navigate("/employee", { replace: true });
  }, [isAuthenticated, user?.role, navigate]);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (step === 1) {
      if (!form.companyName) return setError("Company name is required");
      setError("");
      setStep(2);
      return;
    }

    setError("");
    if (!form.adminName || !form.adminEmail || !form.adminPassword) {
      return setError("Please fill all fields");
    }
    if (form.adminPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await signup({
        companyName: form.companyName,
        countryCode: form.countryCode,
        name: form.adminName,
        email: form.adminEmail,
        password: form.adminPassword,
      });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-forest-500 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-neon/5 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <h1 className="font-manrope font-bold text-3xl text-white leading-tight">
            FlowClaim
          </h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mt-2 font-semibold">
            Reimbursement Management App
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-white/80 text-lg font-manrope font-semibold">
            Get started in 2 steps
          </p>
          <div className="space-y-4">
            {[
              { num: 1, text: "Name your company", active: step === 1 },
              { num: 2, text: "Create admin account", active: step === 2 },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    s.active
                      ? "bg-neon text-forest-900"
                      : step > s.num
                        ? "bg-neon/30 text-white"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <p
                  className={`text-sm ${
                    s.active ? "text-white font-semibold" : "text-white/50"
                  }`}
                >
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs relative z-10">
          © 2026 FlowClaim. All rights reserved.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-surface-100 p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-10 text-center">
            <h1 className="font-manrope font-bold text-2xl text-forest-500">
              FlowClaim
            </h1>
          </div>

          <h2 className="font-manrope font-bold text-2xl text-forest-900 mb-2">
            {step === 1 ? "Create your company" : "Admin account"}
          </h2>
          <p className="text-surface-500 text-sm mb-8">
            {step === 1
              ? "Set up your organization on FlowClaim"
              : "You'll be the first admin of your company"}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      value={form.companyName}
                      onChange={(e) =>
                        updateField("companyName", e.target.value)
                      }
                      placeholder="Acme Corporation"
                      className="w-full bg-white rounded-xl pl-11 pr-4 py-3.5 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <select
                    value={form.countryCode}
                    onChange={(e) => updateField("countryCode", e.target.value)}
                    className="w-full bg-white rounded-xl px-4 py-3.5 text-sm text-forest-900 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter appearance-none"
                  >
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      value={form.adminName}
                      onChange={(e) => updateField("adminName", e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white rounded-xl pl-11 pr-4 py-3.5 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="email"
                      value={form.adminEmail}
                      onChange={(e) =>
                        updateField("adminEmail", e.target.value)
                      }
                      placeholder="admin@company.com"
                      className="w-full bg-white rounded-xl pl-11 pr-4 py-3.5 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="password"
                      value={form.adminPassword}
                      onChange={(e) =>
                        updateField("adminPassword", e.target.value)
                      }
                      placeholder="••••••••"
                      className="w-full bg-white rounded-xl pl-11 pr-4 py-3.5 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
                    />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" loading={loading} className="w-full">
              {step === 1 ? "Continue" : "Create Company & Sign In"}
              <ArrowRight className="w-4 h-4" />
            </Button>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-surface-500 hover:text-forest-600 transition-colors py-2"
              >
                ← Back to company setup
              </button>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-surface-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-forest-500 font-semibold hover:text-neon-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
