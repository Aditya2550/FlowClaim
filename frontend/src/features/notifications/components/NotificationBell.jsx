import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, XCircle, FileText } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { getNotificationLink } from "../utils/notificationHelpers.js";

const ICON_MAP = {
  approval_requested: FileText,
  expense_approved: CheckCircle2,
  expense_rejected: XCircle,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    loadMore,
    hasMore,
    loadingMore,
  } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  function handleNotificationClick(item) {
    markRead(item.id);
    setOpen(false);
    const link = getNotificationLink(item, user?.role);
    if (link) {
      navigate(link);
    }
  }

  function formatRelativeTime(dateString) {
    if (!dateString) return "";
    let normalized = dateString;
    if (typeof dateString === "string") {
      const trimmed = dateString.trim();
      if (!trimmed.endsWith("Z") && !/[+-]\d{2}(:\d{2})?$/.test(trimmed)) {
        normalized = trimmed.replace(" ", "T") + "Z";
      }
    }
    const date = new Date(normalized);
    const now = new Date();
    const diffMs = Math.max(0, now - date);
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

  const badgeText = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        className="relative p-2.5 rounded-xl hover:bg-surface-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-forest-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
            {badgeText}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl overflow-hidden animate-slide-down z-50 shadow-xl border border-surface-100"
          style={{ boxShadow: "0 8px 32px rgba(26, 77, 46, 0.12)" }}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b border-surface-100">
            <h4 className="font-manrope font-bold text-sm text-forest-900">
              Notifications
            </h4>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead()}
                  className="text-xs text-forest-700 hover:text-forest-900 font-semibold transition-colors"
                >
                  Mark all read
                </button>
              )}
              <span className="text-xs text-surface-400">
                {unreadCount} unread
              </span>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-surface-50">
            {notifications.length === 0 && (
              <p className="px-5 py-6 text-sm text-surface-400 text-center">
                No notifications yet.
              </p>
            )}
            {notifications.map((item) => {
              const Icon = ICON_MAP[item.type] || Bell;
              const isApproval = item.type === "approval_requested";
              const isApproved = item.type === "expense_approved";
              const isRejected = item.type === "expense_rejected";

              const iconStyle = isApproval
                ? "bg-amber-50 text-amber-600"
                : isApproved
                  ? "bg-emerald-50 text-emerald-600"
                  : isRejected
                    ? "bg-rose-50 text-rose-600"
                    : "bg-surface-100 text-surface-500";

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`w-full text-left px-5 py-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-surface-50 focus:outline-none focus:bg-surface-50 ${
                    !item.is_read ? "bg-neon-50/20" : ""
                  }`}
                >
                  <div className={`p-2 rounded-xl flex-shrink-0 ${iconStyle}`}>
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
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                  )}
                </button>
              );
            })}
          </div>

          {hasMore && (
            <div className="p-3 border-t border-surface-100 text-center bg-surface-50/50">
              <button
                type="button"
                onClick={() => loadMore()}
                disabled={loadingMore}
                className="text-xs font-semibold text-forest-700 hover:text-forest-900 transition-colors py-1 px-3 rounded-lg hover:bg-surface-100 disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}