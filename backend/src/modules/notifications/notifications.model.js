import { query } from "../../config/db.js";

export const notificationsModel = {
  listByUser(userId) {
    return query(
      "SELECT id, title, body, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
  },

  create({ userId, title, body }) {
    return query(
      "INSERT INTO notifications (user_id, title, body) VALUES ($1, $2, $3) RETURNING id, title, body, is_read, created_at",
      [userId, title, body],
    );
  },
};
