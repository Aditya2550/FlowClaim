CREATE TABLE IF NOT EXISTS approval_rules (
  id SERIAL PRIMARY KEY,
  rule_json JSONB NOT NULL,
  manager_first_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_approval_steps (
  id SERIAL PRIMARY KEY,
  expense_id INT REFERENCES expenses(id),
  step_no INT NOT NULL,
  approver_role VARCHAR(20),
  approver_id INT,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
