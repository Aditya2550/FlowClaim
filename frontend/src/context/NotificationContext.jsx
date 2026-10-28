import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSocket } from "../services/websocketClient.js";
import {
  myNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "../features/notifications/services/notifications.api.js";
import { useAuth } from "./AuthContext.jsx";

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  hasMore: false,
  loading: false,
  loadingMore: false,
  toasts: [],
  push: () => {},
  dismiss: () => {},
  markRead: () => {},
  markAllRead: () => {},
  loadMore: () => {},
});

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
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

  const fetchFirstPage = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await myNotificationsApi({ limit: 20 });
      setNotifications(data.notifications || []);
      setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      setHasMore(Boolean(data.hasMore));
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  // Socket subscription
  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket();
    socket.emit("join:user", user.id);

    function handleNew(payload) {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === payload.id)) return prev;
        return [payload, ...prev];
      });
      if (!payload.is_read) {
        setUnreadCount((prev) => prev + 1);
      }
      pushToast(payload);
    }

    function handleReconnect() {
      fetchFirstPage();
    }

    socket.on("notification:new", handleNew);
    socket.on("reconnect", handleReconnect);
    socket.io?.on("reconnect", handleReconnect);

    return () => {
      socket.off("notification:new", handleNew);
      socket.off("reconnect", handleReconnect);
      socket.io?.off("reconnect", handleReconnect);
    };
  }, [user?.id, pushToast, fetchFirstPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || notifications.length === 0) return;
    const oldest = notifications[notifications.length - 1];
    if (!oldest?.created_at) return;

    setLoadingMore(true);
    try {
      const data = await myNotificationsApi({
        limit: 20,
        before: oldest.created_at,
      });
      const newItems = data.notifications || [];
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const filteredNew = newItems.filter((n) => !existingIds.has(n.id));
        return [...prev, ...filteredNew];
      });
      setHasMore(Boolean(data.hasMore));
    } catch (err) {
      console.error("Failed to load more notifications:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, notifications]);

  const markRead = useCallback(async (id) => {
    let wasUnread = false;
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          if (!n.is_read) wasUnread = true;
          return { ...n, is_read: true };
        }
        return n;
      }),
    );
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    try {
      await markNotificationReadApi(id);
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsReadApi();
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      hasMore,
      loading,
      loadingMore,
      toasts,
      push: pushToast,
      dismiss,
      markRead,
      markAllRead,
      loadMore,
      refetch: fetchFirstPage,
    }),
    [
      notifications,
      unreadCount,
      hasMore,
      loading,
      loadingMore,
      toasts,
      pushToast,
      dismiss,
      markRead,
      markAllRead,
      loadMore,
      fetchFirstPage,
    ],
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