import { query } from "../../config/db.js";

export const approvalRulesModel = {
  async getLatestByCompany(companyId) {
    return query(
      `SELECT id, company_id, type, config, created_at
       FROM approval_rules
       WHERE company_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [companyId],
    );
  },

  async getHistoryByCompany(companyId) {
    return query(
      `SELECT id, company_id, type, config, created_at
       FROM approval_rules
       WHERE company_id = $1
       ORDER BY created_at DESC`,
      [companyId],
    );
  },

  async create({ companyId, type, config }) {
    return query(
      `INSERT INTO approval_rules (company_id, type, config)
       VALUES ($1, $2, $3)
       RETURNING id, company_id, type, config, created_at`,
      [companyId, type, config],
    );
  },
};
