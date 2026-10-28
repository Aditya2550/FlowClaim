import { io } from "socket.io-client";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: (cb) => cb({ token: localStorage.getItem("token") }),
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export function resetSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function reconnectSocketIfDisconnected() {
  if (socket && !socket.connected) {
    socket.connect();
  }
}

