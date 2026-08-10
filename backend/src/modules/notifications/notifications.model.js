import { query } from "../../config/db.js";

export const notificationsModel = {
  listByUser(userId) {
    return query(
      "SELECT id, title, body, is_read, expense_id, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
  },

  create({ userId, title, body, expenseId = null }) {
    return query(
      "INSERT INTO notifications (user_id, title, body, expense_id) VALUES ($1, $2, $3, $4) RETURNING id, title, body, is_read, expense_id, created_at",
      [userId, title, body, expenseId],
    );
  },

  markRead(id, userID) {
    return query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING id, title, body, is_read, expense_id, created_at",
      [id, userID],
    );
  },
};
