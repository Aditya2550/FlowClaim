import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";
import NotificationBell from "../../features/notifications/components/NotificationBell.jsx";
import ToastStack from "../../features/notifications/components/ToastStack.jsx";
import {
  LayoutDashboard,
  FileCheck,
  Receipt,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Search,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/approvals", label: "Approvals", icon: FileCheck },
  { path: "/expenses", label: "My Expenses", icon: Receipt },
  {
    path: "/analytics",
    label: "Analytics",
    icon: LayoutDashboard,
    roles: ["admin", "manager"],
  },
  {
    path: "/admin",
    label: "Approval Rules",
    icon: ShieldCheck,
    roles: ["admin"],
  },
];

export default function AppLayout() {
  const { user, logout, switchRole } = useAuthContext();
  const { toasts, dismiss } = useNotifications();
  const location = useLocation();

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

  return (
    <div className="flex min-h-screen bg-surface-100">
      {/* Sidebar */}
      <aside className="w-[260px] bg-forest-500 flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="font-manrope font-bold text-xl text-white leading-tight">
            Reimbursify
          </h1>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1 font-semibold">
            Reimbursement Management App
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-neon text-forest-900 shadow-lg"
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



        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
          style={{ boxShadow: "0 1px 0 rgba(26, 77, 46, 0.06)" }}
        >
          {/* Search */}
          <div className="flex items-center gap-3 bg-surface-100 rounded-xl px-4 py-2.5 w-full max-w-md">
            <Search className="w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              className="bg-transparent outline-none text-sm text-forest-700 placeholder:text-surface-400 w-full font-inter"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <NotificationBell />

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-forest-900 font-manrope">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider font-semibold">
                  {user?.title || user?.role || "Employee"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-forest-500 flex items-center justify-center text-white font-manrope font-bold text-sm">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Stack */}
      <ToastStack items={toasts} onDismiss={dismiss} />
    </div>
  );
}
