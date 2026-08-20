import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import { ArrowRight, Building2, User, Mail, Lock } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import { motion, AnimatePresence } from "framer-motion";

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

const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.15 }
  }
};

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
    else if (role === "manager" || role === "finance" || role === "director") navigate("/manager", { replace: true });
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
        <div className="absolute top-20 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-neon/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="font-manrope font-bold text-3xl text-white leading-tight">
            FlowClaim
          </h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.3em] mt-2 font-semibold">
            Reimbursement Management App
          </p>
        </div>

        {/* Roadmap visualizer */}
        <div className="relative z-10 space-y-8 my-auto">
          <div>
            <span className="text-xs text-neon uppercase tracking-[0.3em] font-semibold">
              Setup Wizard
            </span>
            <h2 className="text-white font-manrope font-bold text-3xl mt-2">
              Launch your workspace
            </h2>
            <p className="text-white/50 text-sm mt-2 leading-relaxed">
              Create a dashboard environment tailored for your business policies.
            </p>
          </div>

          <div className="relative pl-6 space-y-8">
            {/* Connection timeline line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/10">
              <motion.div
                className="w-full bg-neon origin-top"
                initial={{ height: "0%" }}
                animate={{ height: step === 2 ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {[
              { num: 1, text: "Name your company", sub: "Enter your brand name and location context" },
              { num: 2, text: "Create admin account", sub: "Set up the primary administrative login credentials" },
            ].map((s) => {
              const active = step === s.num;
              const completed = step > s.num;

              return (
                <div key={s.num} className="relative flex items-start gap-4">
                  <div className="relative z-10">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-colors duration-300 ${
                        active
                          ? "bg-neon border-neon text-forest-900 shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                          : completed
                            ? "bg-neon/20 border-neon/30 text-neon"
                            : "bg-forest-900 border-white/10 text-white/40"
                      }`}
                      animate={active ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ repeat: active ? Infinity : 0, duration: 2.5, ease: "easeInOut" }}
                    >
                      {completed ? "✓" : s.num}
                    </motion.div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        active ? "text-white" : completed ? "text-white/80" : "text-white/40"
                      }`}
                    >
                      {s.text}
                    </p>
                    <p
                      className={`text-xs mt-0.5 transition-colors duration-300 ${
                        active ? "text-white/60" : completed ? "text-white/45" : "text-white/20"
                      }`}
                    >
                      {s.sub}
                    </p>
                  </div>
                </div>
              );
            })}
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
          <div className="lg:hidden mb-10 text-center">
            <h1 className="font-manrope font-bold text-2xl text-forest-500">
              FlowClaim
            </h1>
          </div>

          <motion.h2
            variants={itemVariants}
            className="font-manrope font-bold text-2xl text-forest-900 mb-2"
          >
            {step === 1 ? "Create your company" : "Admin account"}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-surface-500 text-sm mb-8"
          >
            {step === 1
              ? "Set up your organization on FlowClaim"
              : "You'll be the first admin of your company"}
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

          <form onSubmit={onSubmit} className="overflow-hidden p-1">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 ? (
                <motion.div
                  key="step1"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
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
                        className="premium-input pl-11 pr-4"
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
                      className="premium-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23b8bebb%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65em_auto] bg-[right_1.25rem_center] bg-no-repeat pr-10"
                    >
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
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
                        className="premium-input pl-11 pr-4"
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
                        className="premium-input pl-11 pr-4"
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
                        className="premium-input pl-11 pr-4"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 space-y-3">
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
            </div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-surface-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-forest-500 font-semibold hover:text-neon-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

