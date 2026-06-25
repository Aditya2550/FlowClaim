import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import { socket } from "../socket/socket.js";

const DEFAULT_MESSAGE = "Workflow updated";

function toToastPayload(eventName, payload) {
    const amount = payload?.amount ? ` (Amount: ${payload.amount})` : "";
    return {
        type: eventName,
        title: payload?.message || `${DEFAULT_MESSAGE}${amount}`,
        autoDismiss: true
    };
}

export function useSocket({ onApprovalUpdate } = {}) {
    const { user, token } = useAuth();
    const { push } = useNotifications();

    useEffect(() => {
        if (!token || !user?.id) return undefined;

        if (!socket.connected) {
            socket.connect();
        }

        // Support both current backend event name and the requested generic event name.
        socket.emit("join:user", user.id);
        socket.emit("join", { userId: user.id });

        const events = [
            "expense_approved",
            "expense_rejected",
            "approval_requested",
            "expense_submitted",
            "notification:new"
        ];

        const handlers = new Map();

        events.forEach((eventName) => {
            const handler = (payload) => {
                push(toToastPayload(eventName, payload));
                if (typeof onApprovalUpdate === "function") {
                    onApprovalUpdate(payload, eventName);
                }
            };
            handlers.set(eventName, handler);
            socket.on(eventName, handler);
        });

        return () => {
            handlers.forEach((handler, eventName) => {
                socket.off(eventName, handler);
            });
            socket.disconnect();
        };
    }, [token, user?.id, push, onApprovalUpdate]);
}
