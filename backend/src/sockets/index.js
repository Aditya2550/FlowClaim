import { Server } from "socket.io";
import { env } from "../config/env.js";
import { registerNotifier } from "../services/notification.service.js";
import { mountNotificationSocket } from "./notification.socket.js";

export function initSockets(server) {
  const io = new Server(server, {
    cors: { origin: env.FRONTEND_URL, credentials: true }
  });

  io.on("connection", (socket) => {
    mountNotificationSocket(io, socket);
  });

  registerNotifier(io);
  return io;
}
