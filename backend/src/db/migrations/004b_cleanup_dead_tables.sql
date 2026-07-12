-- 004b_cleanup_dead_tables.sql

BEGIN;

-- Dead hackathon-era table: written by workflows.model.js / approvals system,
-- never read by approvalEngine.js (which uses approval_rules + approval_steps instead)
DROP TABLE IF EXISTS expense_approval_steps;

COMMIT;