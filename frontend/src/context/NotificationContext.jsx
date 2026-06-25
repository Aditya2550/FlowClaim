import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NotificationContext = createContext({ push: () => {}, notifications: [], dismiss: () => {} });

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const push = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const item = { id, ...notification, createdAt: Date.now() };
    setNotifications((prev) => [item, ...prev]);

    // Auto-dismiss after 5 seconds
    if (notification.autoDismiss !== false) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    }
  }, []);

  const dismiss = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(() => ({ notifications, push, dismiss }), [notifications, push, dismiss]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
