import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";
import NotificationBell from "../../features/notifications/components/NotificationBell.jsx";
import ToastStack from "../../features/notifications/components/ToastStack.jsx";
import {
  CircleCheckBig,
  LayoutDashboard,
  FileCheck,
  Receipt,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Search,
  Menu,
  X,
  Plus,
  BookOpen,
  LifeBuoy
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/approvals", label: "Approvals", icon: FileCheck, roles: ["admin", "manager", "finance", "director"] },
  { path: "/expenses", label: "My Expenses", icon: Receipt },
  {
    path: "/analytics",
    label: "Analytics",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "finance", "director"],
  },
  {
    path: "/admin",
    label: "Approval Rules",
    icon: ShieldCheck,
    roles: ["admin"],
  },
  {
    path: "/my-approvals",
    label: "My Approvals",
    icon: CircleCheckBig,
    roles: ["employee"],
  },
];

export default function AppLayout() {
  const { user, logout, switchRole } = useAuthContext();
  const { toasts, dismiss } = useNotifications();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter(
    (item) =>
      !item.roles ||
      (user && item.roles.includes(String(user.role || "").toLowerCase())),
  );

  function getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  const renderNavItems = () => (
    <>
      <div className="px-6 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1 className="font-manrope font-bold text-xl text-white leading-tight">
            FlowClaim
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-white/80 font-bold uppercase tracking-wider border border-white/5">
              {user?.role || "Employee"} Workspace
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-2 text-white/70 hover:text-white rounded-lg"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 mb-6">
        <Link
          to="/expenses"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-neon text-forest-900 font-bold shadow-[0_4px_15px_rgba(0,255,102,0.25)] hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Claim
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-neon text-forest-900 shadow-lg font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              style={
                isActive
                  ? { boxShadow: "0 4px 15px rgba(0, 255, 102, 0.25)" }
                  : {}
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-8 pb-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Resources
          </p>
          <div className="space-y-1">
            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Company Policy
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LifeBuoy className="w-4 h-4" />
              Help Center
            </Link>
          </div>
        </div>
      </nav>

      {/* SaaS Feature: Fintech Limit Widget */}
      <div className="px-4 mt-auto mb-4">
        <div className="bg-[#0A1A10]/40 rounded-xl p-4 border border-white/5 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/90">Monthly Limit</span>
            <span className="text-[10px] font-bold text-emerald-400">82%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2.5">
            <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ width: "82%" }} />
          </div>
          <p className="text-[10px] text-white/50 font-medium font-inter">
            $4,100 of $5,000 used
          </p>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-1">
        <Link
          to="#"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            logout();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-surface-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[260px] bg-gradient-to-b from-forest-500 to-forest-700 flex-col flex-shrink-0 relative overflow-hidden">
        {/* Sleek Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-emerald-300/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full w-full">
          {renderNavItems()}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-[280px] max-w-[80vw] bg-gradient-to-b from-forest-500 to-forest-700 flex flex-col h-full shadow-2xl z-10 animate-slide-in-left overflow-hidden">
            {/* Sleek Background Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-20 left-0 w-48 h-48 bg-emerald-300/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full w-full">
              {renderNavItems()}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between"
          style={{ boxShadow: "0 1px 0 rgba(26, 77, 46, 0.06)" }}
        >
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-forest-800 hover:bg-surface-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-manrope font-bold text-lg text-forest-900">
              FlowClaim
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden sm:flex items-center gap-3 bg-surface-100 rounded-xl px-4 py-2 w-full max-w-xs md:max-w-md">
            <Search className="w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="bg-transparent outline-none text-sm text-forest-700 placeholder:text-surface-400 w-full font-inter"
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <NotificationBell />

            {/* User details */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-forest-900 font-manrope">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-surface-500 uppercase tracking-[0.15em] font-semibold">
                  {user?.title || user?.role || "Employee"}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-forest-600 to-emerald-500 flex items-center justify-center text-white font-manrope font-bold text-xs sm:text-sm shadow-sm ring-2 ring-white">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Stack */}
      <ToastStack items={toasts} onDismiss={dismiss} />
    </div>
  );
}
