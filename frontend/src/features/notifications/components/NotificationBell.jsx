import { useState, useRef, useEffect } from "react";
import { Bell, Zap, FileText, BarChart3, X } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "../../../utils/mockData.js";

const ICON_MAP = {
  SOCKET_UPDATE: Zap,
  NEW_EXPENSE: FileText,
  REPORT: BarChart3,
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef(null);

  const unreadCount = items.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markRead(id) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
            <h4 className="font-manrope font-bold text-sm text-forest-900">
              Notifications
            </h4>
            <span className="text-xs text-surface-400">{unreadCount} new</span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {items.map((item) => {
              const Icon = ICON_MAP[item.type] || Bell;
              return (
                <div
                  key={item.id}
                  onClick={() => markRead(item.id)}
                  className={`px-5 py-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-surface-50 ${
                    !item.read ? "bg-neon-50/30" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl flex-shrink-0 ${
                      item.type === "SOCKET_UPDATE"
                        ? "bg-neon-50 text-forest-500"
                        : "bg-surface-100 text-surface-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-forest-900 leading-snug">
                      {item.title}
                    </p>
                    <p className="text-xs text-surface-400 mt-1">{item.time}</p>
                  </div>
                  {!item.read && (
                    <div className="w-2 h-2 rounded-full bg-neon flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-5 py-3 text-center">
            <button className="text-xs text-forest-500 font-semibold hover:text-neon-700 transition-colors">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
