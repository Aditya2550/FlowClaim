export const approvalQueries = {
  queueForManager: "SELECT * FROM expenses WHERE current_step_role = $1 AND status = 'IN_REVIEW'",
  queueForManagerId: "SELECT * FROM expenses WHERE current_approver_id = $1 AND status = 'IN_REVIEW'",
  updateDecision: "UPDATE expenses SET status = $1, current_step = $2 WHERE id = $3 RETURNING *",
  breadcrumbSteps: "SELECT step_no, approver_role, approver_id, status FROM expense_approval_steps WHERE expense_id = $1 ORDER BY step_no"
};
