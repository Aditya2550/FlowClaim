import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Button from "../../components/ui/Button.jsx";

export default function LoginForm() {
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!email) return setError("Email is required");
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 animate-slide-down">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-50 rounded-xl px-4 py-3 text-sm text-forest-900 placeholder:text-surface-400 outline-none focus:ring-2 focus:ring-neon/30 transition-all font-inter pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-forest-600"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Sign In
        <ArrowRight className="w-4 h-4" />
      </Button>
    </form>
  );
}
