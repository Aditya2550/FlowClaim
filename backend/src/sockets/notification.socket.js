export function mountNotificationSocket(io, socket) {
  socket.on("join:user", (userId) => {
    socket.join(`user:${userId}`);
  });
  socket.on("disconnect", () => {
    io.emit("presence:update", { socketId: socket.id, status: "offline" });
  });
}
