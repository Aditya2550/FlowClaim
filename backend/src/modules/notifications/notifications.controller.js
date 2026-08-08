import { asyncHandler } from "../../utils/asyncHandler.js";
import { notificationsModel } from "./notifications.model.js";

export const myNotifications = asyncHandler(async (req, res) => {
  const rows = await notificationsModel.listByUser(req.user.id);
  res.json({ notifications: rows.rows });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const result = await notificationsModel.markRead(req.params.id, req.user.id);
  if (!result.rows[0])
    return res.status(404).json({ message: "Notification not found" });
  res.json({ notification: result.rows[0] });
});
