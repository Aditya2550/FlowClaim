let ioRef = null;
export function registerNotifier(io) {
  ioRef = io;
}
export function notifyUser(userId, payload) {
  if (!ioRef) return;
  ioRef.to(`user:${userId}`).emit("notification:new", payload);
}
