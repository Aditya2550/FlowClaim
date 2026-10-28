import { notificationsModel } from "../modules/notifications/notifications.model.js";

let ioRef = null;
export function registerNotifier(io) {
  ioRef = io;
}
export function notifyUser(userId, payload) {
  if (!ioRef) return;
  ioRef.to(`user:${userId}`).emit("notification:new", payload);
}

export async function safeNotify({
  userId,
  title,
  body,
  expenseId = null,
  type = "general",
}) {
  try {
    const res = await notificationsModel.create({
      userId,
      title,
      body,
      expenseId,
      type,
    });
    const notification = res.rows[0];
    notifyUser(userId, notification);
    return notification;
  } catch (error) {
    console.error("safeNotify failed to send notification:", error.message);
    return null;
  }
}
