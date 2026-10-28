import { query } from "../../config/db.js";

export const notificationsModel = {
  listByUser(userId, { limit = 20, before = null } = {}) {
    const params = [userId];
    let sql =
      "SELECT id, title, body, is_read, expense_id, type, created_at FROM notifications WHERE user_id = $1";
    if (before) {
      params.push(before);
      sql += ` AND created_at < $${params.length}`;
    }
    params.push(limit + 1);
    sql += ` ORDER BY created_at DESC LIMIT $${params.length}`;
    return query(sql, params);
  },

  create({ userId, title, body, expenseId = null, type = "general" }) {
    return query(
      "INSERT INTO notifications (user_id, title, body, expense_id, type) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, body, is_read, expense_id, type, created_at",
      [userId, title, body, expenseId, type],
    );
  },

  markRead(id, userId) {
    return query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING id, title, body, is_read, expense_id, type, created_at",
      [id, userId],
    );
  },

  async countUnread(userId) {
    const res = await query(
      "SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = false",
      [userId],
    );
    return res.rows[0]?.count || 0;
  },

  async markAllRead(userId) {
    const res = await query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false",
      [userId],
    );
    return res.rowCount;
  },

  resolveExpenseNotifications(userId, expenseId) {
    return query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 AND expense_id = $2 AND type = 'approval_requested' AND is_read = false RETURNING id, title, body, is_read, expense_id, type, created_at",
      [userId, expenseId],
    );
  },

  resolveAllForExpense(expenseId) {
    return query(
      "UPDATE notifications SET is_read = true WHERE expense_id = $1 AND type = 'approval_requested' AND is_read = false RETURNING id, title, body, is_read, expense_id, type, created_at",
      [expenseId],
    );
  },
};
