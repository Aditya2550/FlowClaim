CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id),
  employee_id INT REFERENCES users(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount_original NUMERIC(12,2) NOT NULL,
  currency_original VARCHAR(8) NOT NULL,
  amount_company NUMERIC(12,2) NOT NULL,
  currency_company VARCHAR(8) NOT NULL,
  risk_level VARCHAR(10),
  status VARCHAR(20) NOT NULL,
  current_step INT DEFAULT 1,
  current_step_role VARCHAR(20) DEFAULT 'MANAGER',
  current_approver_id INT,
  created_at TIMESTAMP DEFAULT NOW()
);
