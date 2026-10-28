ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(30) NOT NULL DEFAULT 'general';

UPDATE notifications
SET type = 'approval_requested'
WHERE title IN ('New expense pending your approval', 'Expense pending your approval');

UPDATE notifications
SET type = 'expense_approved'
WHERE title = 'Expense approved';

UPDATE notifications
SET type = 'expense_rejected'
WHERE title = 'Expense rejected';

CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE is_read = false;
