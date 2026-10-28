export function mountNotificationSocket(io, socket) {
  if (socket.data?.userId) {
    socket.join(`user:${socket.data.userId}`);
  }

  socket.on("join:user", (userId) => {
    if (userId === socket.data?.userId) {
      socket.join(`user:${userId}`);
    }
  });
  socket.on("disconnect", () => {
    io.emit("presence:update", { socketId: socket.id, status: "offline" });
  });
}
