import { useEffect, useState } from "react";
import { getSocket } from "../../../services/websocketClient.js";

export function useRealtimeNotifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = getSocket();
        socket.emit("join:user", 1);
        socket.on("notification:new", (payload) => setNotifications((prev) => [payload, ...prev]));
        return () => socket.off("notification:new");
    }, []);

    return notifications;
}
