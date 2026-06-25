export const authQueries = {
  findByEmail: "SELECT id, company_id, name, email, password_hash, role, manager_id, created_at FROM users WHERE email = $1",
  findById: "SELECT id, company_id, name, email, role, manager_id, created_at FROM users WHERE id = $1",
  createCompany: `INSERT INTO companies (name, currency, country_code)
                  VALUES ($1, $2, $3)
                  RETURNING id, name, currency, country_code, created_at`,
  createAdmin: `INSERT INTO users (company_id, name, email, password_hash, role)
                VALUES ($1, $2, $3, $4, 'admin')
                RETURNING id, company_id, name, email, role, manager_id, created_at`
};
