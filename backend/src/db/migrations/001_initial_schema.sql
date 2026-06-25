-- 001_initial_schema.sql
-- Complete initial schema for Reimbursement Management System (PERN)
-- Uses UUID primary keys, enum types, JSONB config, indexes, and trigger automation.

BEGIN;

-- UUID generator (PostgreSQL 13+).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================
-- Enum Types
-- =============================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_category') THEN
    CREATE TYPE expense_category AS ENUM ('Travel', 'Food', 'Office', 'Other');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_status') THEN
    CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_rule_type') THEN
    CREATE TYPE approval_rule_type AS ENUM ('sequential', 'percentage', 'specific');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_step_status') THEN
    CREATE TYPE approval_step_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

-- =============================
-- Tables
-- =============================
-- Stores per-tenant company profile and base finance settings.
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  country_code VARCHAR(8) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE companies IS 'Tenant company records with default currency and country information.';

-- Stores all users with role and optional reporting hierarchy (self-managed by manager_id).
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  manager_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'System users scoped to a company with role-based access and manager hierarchy.';

-- Stores employee expense claims in source and base currencies with approval status tracking.
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10) NOT NULL,
  converted_amount NUMERIC(14,2) NOT NULL CHECK (converted_amount >= 0),
  base_currency VARCHAR(10) NOT NULL,
  category expense_category NOT NULL,
  vendor TEXT,
  description TEXT,
  receipt_url TEXT,
  status expense_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE expenses IS 'Expense submissions with amounts, metadata, receipt link, and current approval state.';

-- Stores rule configurations per company for dynamic approval routing.
CREATE TABLE IF NOT EXISTS approval_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type approval_rule_type NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE approval_rules IS 'Per-company approval logic definitions (sequential, percentage, or specific approver).';

-- Stores each approval action step per expense for sequential auditability.
CREATE TABLE IF NOT EXISTS approval_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  sequence INT NOT NULL CHECK (sequence > 0),
  status approval_step_status NOT NULL DEFAULT 'pending',
  comment TEXT,
  acted_at TIMESTAMPTZ
);

COMMENT ON TABLE approval_steps IS 'Step-by-step approval decisions for each expense with approver and action timeline.';

-- =============================
-- Indexes (FK + status)
-- =============================
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_manager_id ON users(manager_id);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON expenses(company_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);

CREATE INDEX IF NOT EXISTS idx_approval_rules_company_id ON approval_rules(company_id);

CREATE INDEX IF NOT EXISTS idx_approval_steps_expense_id ON approval_steps(expense_id);
CREATE INDEX IF NOT EXISTS idx_approval_steps_approver_id ON approval_steps(approver_id);
CREATE INDEX IF NOT EXISTS idx_approval_steps_status ON approval_steps(status);

-- Optional helper index for deterministic step ordering within an expense.
CREATE UNIQUE INDEX IF NOT EXISTS ux_approval_steps_expense_sequence
  ON approval_steps(expense_id, sequence);

-- =============================
-- Trigger: expenses.updated_at
-- =============================
CREATE OR REPLACE FUNCTION set_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_expenses_set_updated_at ON expenses;
CREATE TRIGGER trg_expenses_set_updated_at
BEFORE UPDATE ON expenses
FOR EACH ROW
EXECUTE FUNCTION set_expenses_updated_at();

COMMIT;
