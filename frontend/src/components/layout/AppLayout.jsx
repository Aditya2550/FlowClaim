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
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1 font-semibold">
            Reimbursement App
          </p>
        </div>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-2 text-white/70 hover:text-white rounded-lg"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
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
      </nav>

      <div className="px-4 pb-6 mt-auto">
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            logout();
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
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
      <aside className="hidden md:flex w-[260px] bg-forest-500 flex-col flex-shrink-0">
        {renderNavItems()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-[280px] max-w-[80vw] bg-forest-500 flex flex-col h-full shadow-2xl z-10 animate-slide-in-left">
            {renderNavItems()}
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
                <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">
                  {user?.title || user?.role || "Employee"}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest-500 flex items-center justify-center text-white font-manrope font-bold text-xs sm:text-sm">
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
