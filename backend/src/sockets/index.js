import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { redis } from "../config/redis.js";
import { registerNotifier } from "../services/notification.service.js";
import { mountNotificationSocket } from "./notification.socket.js";

export function initSockets(server) {
  const io = new Server(server, {
    cors: { origin: env.FRONTEND_URL, credentials: true }
  });

  io.use(async (socket, next) => {
    const rawToken = socket.handshake.auth?.token;
    const token = rawToken?.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;
    if (!token) {
      return next(new Error("Missing token"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch {
      return next(new Error("Invalid token"));
    }

    if (decoded.jti) {
      try {
        const isBlacklisted = await redis.exists(`blacklist:${decoded.jti}`);
        if (isBlacklisted) {
          return next(new Error("Token has been revoked"));
        }
      } catch (error) {
        console.error("Redis blacklist check failed:", error.message);
      }
    }

    socket.data.userId = decoded.userId;
    socket.data.role = decoded.role;
    socket.data.companyId = decoded.companyId;
    next();
  });

  io.on("connection", (socket) => {
    mountNotificationSocket(io, socket);
  });

  registerNotifier(io);
  return io;
}
