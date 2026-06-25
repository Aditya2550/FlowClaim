export const expenseQueries = {
  createExpense: `INSERT INTO expenses
    (company_id, employee_id, title, category, amount_original, currency_original, amount_company, currency_company, status, current_step)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
  listMine: "SELECT * FROM expenses WHERE employee_id = $1 ORDER BY created_at DESC",
  findById: "SELECT * FROM expenses WHERE id = $1"
};
