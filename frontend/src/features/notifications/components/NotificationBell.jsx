import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Zap, FileText, BarChart3 } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const ICON_MAP = {
  SOCKET_UPDATE: Zap,
  NEW_EXPENSE: FileText,
  REPORT: BarChart3,
};

const APPROVER_ROLES = ["manager", "finance", "director", "admin"];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, markRead } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const canApprove = APPROVER_ROLES.includes(String(user?.role || "").toLowerCase());

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleNotificationClick(item) {
    markRead(item.id);
    if (item.expense_id && canApprove) {
      setOpen(false);
      navigate("/approvals");
    }
  }

  function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl hover:bg-surface-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-forest-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl overflow-hidden animate-slide-down z-50"
          style={{ boxShadow: "0 8px 32px rgba(26, 77, 46, 0.12)" }}
        >
          <div className="px-5 py-4 flex items-center justify-between">
            <h4 className="font-manrope font-bold text-sm text-forest-900">Notifications</h4>
            <span className="text-xs text-surface-400">{unreadCount} new</span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-5 py-6 text-sm text-surface-400 text-center">No notifications yet.</p>
            )}
            {notifications.map((item) => {
              const Icon = ICON_MAP[item.type] || Bell;
              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`px-5 py-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-surface-50 ${
                    !item.is_read ? "bg-neon-50/30" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl flex-shrink-0 ${
                      item.type === "SOCKET_UPDATE" ? "bg-neon-50 text-forest-500" : "bg-surface-100 text-surface-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                 <div className="flex-1 min-w-0">
  <p className="text-sm text-forest-900 leading-snug font-medium">
    {item.title}
  </p>
  {item.body && (
    <p className="text-xs text-surface-500 mt-0.5 leading-snug">
      {item.body}
    </p>
  )}
 <p className="text-xs text-surface-400 mt-1">
  {formatRelativeTime(item.created_at)}
</p>
</div>
                  {!item.is_read && (
                    <div className="w-2 h-2 rounded-full bg-neon flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}