import { asyncHandler } from "../../utils/asyncHandler.js";
import { notificationsModel } from "./notifications.model.js";

export const myNotifications = asyncHandler(async (req, res) => {
  const rows = await notificationsModel.listByUser(req.user.id);
  res.json({ notifications: rows.rows });
});
