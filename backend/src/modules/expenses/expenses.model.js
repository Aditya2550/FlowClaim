import { pool } from "../../config/db.js";

export const expensesModel = {
  async findCompanyBaseCurrency(companyId, client = pool) {
    const result = await client.query(
      "SELECT id, currency FROM companies WHERE id = $1",
      [companyId]
    );
    return result.rows[0] || null;
  },

  async findUserById(userId, client = pool) {
    const result = await client.query(
      "SELECT id, company_id, role, manager_id FROM users WHERE id = $1",
      [userId]
    );
    return result.rows[0] || null;
  },

  async listCompanyUsersByRole(companyId, role, client = pool) {
    const result = await client.query(
      "SELECT id, role FROM users WHERE company_id = $1 AND role = $2 ORDER BY created_at ASC",
      [companyId, role]
    );
    return result.rows;
  },

  async getSequentialApprovalRule(companyId, client = pool) {
    const result = await client.query(
      `SELECT id, type, config
       FROM approval_rules
       WHERE company_id = $1 AND type = 'sequential'
       ORDER BY created_at DESC
       LIMIT 1`,
      [companyId]
    );
    return result.rows[0] || null;
  },

  async insertExpense(payload, client = pool) {
    const result = await client.query(
      `INSERT INTO expenses
       (user_id, company_id, amount, currency, converted_amount, base_currency, category, vendor, description, receipt_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
       RETURNING *`,
      [
        payload.userId,
        payload.companyId,
        payload.amount,
        payload.currency,
        payload.convertedAmount,
        payload.baseCurrency,
        payload.category,
        payload.vendor,
        payload.description,
        payload.receiptUrl
      ]
    );
    return result.rows[0];
  },

  async insertApprovalStep({ expenseId, approverId, sequence }, client = pool) {
    const result = await client.query(
      `INSERT INTO approval_steps (expense_id, approver_id, sequence, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [expenseId, approverId, sequence]
    );
    return result.rows[0];
  },

  async getExpenseWithSteps(expenseId, client = pool) {
    const result = await client.query(
      `SELECT
         e.*,
         COALESCE(steps.approval_steps, '[]'::json) AS approval_steps
       FROM expenses e
       LEFT JOIN LATERAL (
         SELECT json_agg(
           json_build_object(
             'id', s.id,
             'approver_id', s.approver_id,
             'sequence', s.sequence,
             'status', s.status,
             'comment', s.comment,
             'acted_at', s.acted_at
           )
           ORDER BY s.sequence
         ) AS approval_steps
         FROM approval_steps s
         WHERE s.expense_id = e.id
       ) steps ON TRUE
       WHERE e.id = $1`,
      [expenseId]
    );
    return result.rows[0] || null;
  },

  async listExpenses({ userId, companyId, role, status }, client = pool) {
    const params = [];
    const where = [];

    if (String(role).toLowerCase() === "employee") {
      params.push(userId);
      where.push(`e.user_id = $${params.length}`);
    } else {
      params.push(companyId);
      where.push(`e.company_id = $${params.length}`);
      if (status) {
        params.push(status);
        where.push(`e.status = $${params.length}`);
      }
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const result = await client.query(
      `SELECT
         e.*,
         COALESCE(steps.approval_steps, '[]'::json) AS approval_steps
       FROM expenses e
       LEFT JOIN LATERAL (
         SELECT json_agg(
           json_build_object(
             'id', s.id,
             'approver_id', s.approver_id,
             'sequence', s.sequence,
             'status', s.status,
             'comment', s.comment,
             'acted_at', s.acted_at
           )
           ORDER BY s.sequence
         ) AS approval_steps
         FROM approval_steps s
         WHERE s.expense_id = e.id
       ) steps ON TRUE
       ${whereSql}
       ORDER BY e.submitted_at DESC`,
      params
    );
    return result.rows;
  },

  async listPendingForApprover({ userId, companyId }, client = pool) {
    const result = await client.query(
      `SELECT
         e.*,
         COALESCE(steps.approval_steps, '[]'::json) AS approval_steps
       FROM expenses e
       JOIN approval_steps s
         ON s.expense_id = e.id
       LEFT JOIN LATERAL (
         SELECT json_agg(
           json_build_object(
             'id', t.id,
             'approver_id', t.approver_id,
             'sequence', t.sequence,
             'status', t.status,
             'comment', t.comment,
             'acted_at', t.acted_at
           )
           ORDER BY t.sequence
         ) AS approval_steps
         FROM approval_steps t
         WHERE t.expense_id = e.id
       ) steps ON TRUE
       WHERE e.company_id = $1
         AND e.status = 'pending'
         AND s.approver_id = $2
         AND s.status = 'pending'
         AND NOT EXISTS (
           SELECT 1
           FROM approval_steps prev
           WHERE prev.expense_id = s.expense_id
             AND prev.sequence < s.sequence
             AND prev.status <> 'approved'
         )
       ORDER BY e.submitted_at ASC`,
      [companyId, userId]
    );
    return result.rows;
  },

  async findCurrentTurnStep({ expenseId, approverId }, client = pool) {
    const result = await client.query(
      `SELECT s.*
       FROM approval_steps s
       WHERE s.expense_id = $1
         AND s.approver_id = $2
         AND s.status = 'pending'
         AND NOT EXISTS (
           SELECT 1
           FROM approval_steps prev
           WHERE prev.expense_id = s.expense_id
             AND prev.sequence < s.sequence
             AND prev.status <> 'approved'
         )
       ORDER BY s.sequence ASC
       LIMIT 1`,
      [expenseId, approverId]
    );
    return result.rows[0] || null;
  },

  async markStepApproved({ stepId, comment }, client = pool) {
    await client.query(
      `UPDATE approval_steps
       SET status = 'approved', comment = COALESCE($2, comment), acted_at = NOW()
       WHERE id = $1`,
      [stepId, comment || null]
    );
  },

  async markStepRejected({ stepId, comment }, client = pool) {
    await client.query(
      `UPDATE approval_steps
       SET status = 'rejected', comment = $2, acted_at = NOW()
       WHERE id = $1`,
      [stepId, comment]
    );
  },

  async countPendingSteps(expenseId, client = pool) {
    const result = await client.query(
      "SELECT COUNT(*)::int AS count FROM approval_steps WHERE expense_id = $1 AND status = 'pending'",
      [expenseId]
    );
    return result.rows[0].count;
  },

  async updateExpenseStatus(expenseId, status, client = pool) {
    await client.query("UPDATE expenses SET status = $2 WHERE id = $1", [expenseId, status]);
  },

  async findExpenseForCompany(expenseId, companyId, client = pool) {
    const result = await client.query(
      "SELECT * FROM expenses WHERE id = $1 AND company_id = $2",
      [expenseId, companyId]
    );
    return result.rows[0] || null;
  }
};
