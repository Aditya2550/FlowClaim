-- 008_fix_approval_steps_percentage_constraint.sql
-- Drop unique index on (expense_id, sequence) so percentage / parallel rules can assign multiple approvers at sequence 1.
DROP INDEX IF EXISTS ux_approval_steps_expense_sequence;

-- Prevent assigning the exact same approver multiple times to the same step
CREATE UNIQUE INDEX IF NOT EXISTS ux_approval_steps_expense_sequence_approver
  ON approval_steps(expense_id, sequence, approver_id);

-- Keep non-unique index for fast sequence ordering
CREATE INDEX IF NOT EXISTS idx_approval_steps_expense_sequence
  ON approval_steps(expense_id, sequence);
