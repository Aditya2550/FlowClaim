-- 004_fix_roles_and_cleanup.sql

-- Add missing approver roles used by approvalEngine.js
-- Must run in its own transaction: ALTER TYPE ... ADD VALUE cannot be used
-- in the same transaction as a later statement that reads the new value.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'finance';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'director';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'cfo';