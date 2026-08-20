import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import { Eye, EyeOff, ArrowRight, FileText, ShieldCheck, UserCheck, CreditCard } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Expense Submitted",
    desc: "Digital claims submitted by employee",
    icon: FileText,
  },
  {
    title: "Policy Check",
    desc: "Instant compliance & validation check",
    icon: ShieldCheck,
  },
  {
    title: "Manager Approval",
    desc: "Dynamic routing & automated alerts",
    icon: UserCheck,
  },
  {
    title: "Disbursed",
    desc: "Fast reimbursement payment complete",
    icon: CreditCard,
  },
];

function MetricCounter() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 2.5; // Represents $2.5M
    const duration = 1500;
    const startTime = performance.now();
    let animationFrameId;

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
      setValue(ease * end);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      }
    }

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <span className="font-manrope font-bold text-5xl text-neon select-none">
      ${value.toFixed(1)}M+
    </span>
  );
}

function ReimbursementFlow() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative pl-6 space-y-4">
      {/* Connecting line */}
      <div className="absolute left-[17px] top-4 bottom-4 w-[2px] bg-white/10">
        <motion.div
          className="w-full bg-neon origin-top"
          initial={{ height: "0%" }}
          animate={{ height: `${((activeStep) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === activeStep;
        const isCompleted = idx < activeStep;

        return (
          <motion.div
            key={step.title}
            className={`relative flex items-start gap-4 p-3.5 rounded-2xl border transition-all duration-300 ${
              isActive
                ? "bg-white/10 border-white/15 shadow-[0_4px_20px_rgba(0,255,102,0.06)]"
                : "bg-transparent border-transparent"
            }`}
            animate={{
              scale: isActive ? 1.02 : 1.0,
              opacity: isActive ? 1.0 : 0.5,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* Step Node */}
            <div className="relative z-10 flex items-center justify-center">
              <motion.div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors duration-300 ${
                  isActive
                    ? "bg-neon border-neon text-forest-900 shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                    : isCompleted
                      ? "bg-neon/20 border-neon/30 text-neon"
                      : "bg-forest-900 border-white/10 text-white/40"
                }`}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                <Icon className="w-4.5 h-4.5" />
              </motion.div>
            </div>

            {/* Step Text */}
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-semibold transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/80"
                }`}
              >
                {step.title}
              </h4>
              <p
                className={`text-xs mt-0.5 transition-colors duration-300 ${
                  isActive ? "text-white/60" : "text-white/40"
                }`}
              >
                {step.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

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
    else if (role === "manager" || role === "finance" || role === "director") navigate("/manager", { replace: true });
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
      else if (role === "manager" || role === "finance" || role === "director") navigate("/manager", { replace: true });
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-neon/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="font-manrope font-bold text-3xl text-white leading-tight">
            FlowClaim
          </h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mt-2 font-semibold">
            Reimbursement Management App
          </p>
        </div>

        {/* Dynamic Connected Flow diagram */}
        <div className="relative z-10 my-auto py-8">
          <ReimbursementFlow />
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <MetricCounter />
            <p className="text-white/60 text-sm mt-2">
              Processed this quarter across multiple company units
            </p>
          </div>
        </div>

        <p className="text-white/30 text-xs relative z-10">
          © 2026 FlowClaim. All rights reserved.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-surface-100 p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Mobile Brand */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="font-manrope font-bold text-2xl text-forest-500">
              FlowClaim
            </h1>
            <p className="text-xs text-surface-500 uppercase tracking-widest mt-1">
              Reimbursement Management App
            </p>
          </div>

          <motion.h2
            variants={itemVariants}
            className="font-manrope font-bold text-2xl text-forest-900 mb-2"
          >
            Welcome back
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-surface-500 text-sm mb-8"
          >
            Sign in to your account to continue
          </motion.p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-6"
            >
              {error}
            </motion.div>
          )}

          <motion.form
            variants={itemVariants}
            onSubmit={onSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="premium-input"
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
                  className="premium-input pr-12"
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

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-surface-500">
              First time?{" "}
              <Link
                to="/signup"
                className="text-forest-500 font-semibold hover:text-neon-700 transition-colors"
              >
                Create your company
              </Link>
            </p>
          </motion.div>

          {/* Auth Hint */}
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-surface-200 rounded-xl p-4"
          >
            <p className="text-xs font-semibold text-forest-700 mb-2">
              Sign-In
            </p>
            <p className="text-xs text-surface-500 leading-relaxed">
              Use a registered account from your company setup or demo seed
              users.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

