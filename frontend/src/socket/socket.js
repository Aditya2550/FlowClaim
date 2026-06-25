import { io } from "socket.io-client";

const apiUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3000/api";
const socketBaseUrl =
    import.meta.env.VITE_SOCKET_URL ||
    apiUrl.replace(/\/api\/?$/, "");

export const socket = io(socketBaseUrl, {
    autoConnect: false,
    transports: ["websocket", "polling"]
});
