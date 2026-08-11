import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!isAuthenticated) return;

  const role = String(user?.role || "").toLowerCase();
  if (role === "admin") navigate("/admin", { replace: true });
  else if (role === "manager") navigate("/manager", { replace: true });
  else if (role === "finance") navigate("/manager", { replace: true });
  else if (role === "director") navigate("/manager", { replace: true });
  else navigate("/employee", { replace: true });
}, [isAuthenticated, user?.role, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    if (!password) return setError("Password is required");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      const role = String(loggedInUser?.role || "").toLowerCase();

      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "manager") navigate("/manager", { replace: true });
      else if (role === "finance") navigate("/manager", { replace: true });
      else if (role === "director") navigate("/manager", { replace: true });
      else navigate("/employee", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Invalid credentials. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-forest-500 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-neon/5 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <h1 className="font-manrope font-bold text-3xl text-white leading-tight">
            FlowClaim
          </h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mt-2 font-semibold">
            Reimbursement Management App
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-neon font-manrope font-bold text-5xl">$2.4M</p>
            <p className="text-white/60 text-sm mt-2">
              Processed this quarter across 340+ reimbursements
            </p>
          </div>
          <div className="space-y-3">
            {[
              "AI-powered OCR receipt scanning",
              "Multi-currency live conversion",
              "Intelligent approval workflows",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neon" />
                <p className="text-white/70 text-sm">{feature}</p>
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
          {/* Mobile Brand */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="font-manrope font-bold text-2xl text-forest-500">
              FlowClaim
            </h1>
            <p className="text-xs text-surface-500 uppercase tracking-widest mt-1">
              Reimbursement Management App
            </p>
          </div>

          <h2 className="font-manrope font-bold text-2xl text-forest-900 mb-2">
            Welcome back
          </h2>
          <p className="text-surface-500 text-sm mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white rounded-xl px-4 py-3.5 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white rounded-xl px-4 py-3.5 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-forest-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-surface-500">
              First time?{" "}
              <Link
                to="/signup"
                className="text-forest-500 font-semibold hover:text-neon-700 transition-colors"
              >
                Create your company
              </Link>
            </p>
          </div>

          {/* Auth Hint */}
          <div className="mt-8 bg-surface-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-forest-700 mb-2">
              Sign-In
            </p>
            <p className="text-xs text-surface-500 leading-relaxed">
              Use a registered account from your company setup or demo seed
              users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
