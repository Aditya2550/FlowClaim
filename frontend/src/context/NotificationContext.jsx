import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSocket } from "../services/websocketClient.js";
import { myNotificationsApi, markNotificationReadApi } from "../features/notifications/services/notifications.api.js";
import { useAuth } from "./AuthContext.jsx";

const NotificationContext = createContext({
  notifications: [],
  toasts: [],
  push: () => {},
  dismiss: () => {},
  markRead: () => {},
});

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Toast (auto-dismiss) queue
  const pushToast = useCallback((notification) => {
    const id = notification.id ?? Date.now() + Math.random();
    const item = { id, ...notification, createdAt: Date.now() };
    setToasts((prev) => [item, ...prev]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Initial load from REST
  useEffect(() => {
    if (!user?.id) return;
    myNotificationsApi()
      .then((data) => setNotifications(data.notifications || []))
      .catch((err) => console.error("Failed to load notifications:", err));
  }, [user?.id]);

  // Socket subscription
  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket();
    socket.emit("join:user", user.id);

    function handleNew(payload) {
      setNotifications((prev) => [payload, ...prev]);
      pushToast(payload);
    }

    socket.on("notification:new", handleNew);
    return () => socket.off("notification:new", handleNew);
  }, [user?.id, pushToast]);

  const markRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    try {
      await markNotificationReadApi(id);
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  }, []);

  const value = useMemo(
    () => ({ notifications, toasts, push: pushToast, dismiss, markRead }),
    [notifications, toasts, pushToast, dismiss, markRead],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}