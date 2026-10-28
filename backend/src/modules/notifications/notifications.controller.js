import { asyncHandler } from "../../utils/asyncHandler.js";
import { notificationsModel } from "./notifications.model.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const myNotifications = asyncHandler(async (req, res) => {
  let limit = parseInt(req.query.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = 20;
  } else if (limit > 50) {
    limit = 50;
  }

  let before = null;
  if (
    req.query.before !== undefined &&
    req.query.before !== null &&
    req.query.before !== ""
  ) {
    const parsedDate = new Date(req.query.before);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid before date" });
    }
    before = parsedDate.toISOString();
  }

  const result = await notificationsModel.listByUser(req.user.userId, {
    limit,
    before,
  });
  const hasMore = result.rows.length > limit;
  const notifications = hasMore ? result.rows.slice(0, limit) : result.rows;
  const unreadCount = await notificationsModel.countUnread(req.user.userId);

  res.json({
    notifications,
    unreadCount,
    hasMore,
  });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const updated = await notificationsModel.markAllRead(req.user.userId);
  res.json({ updated });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ message: "Invalid notification id" });
  }

  const result = await notificationsModel.markRead(id, req.user.userId);
  if (!result.rows[0])
    return res.status(404).json({ message: "Notification not found" });
  res.json({ notification: result.rows[0] });
});
