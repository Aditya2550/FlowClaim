import { query } from "../../config/db.js";
import { approvalQueries } from "../../db/queries/approvals/approvals.queries.js";

export const approvalsModel = {
  queueByRole(role) {
    return query(approvalQueries.queueForManager, [role]);
  },
  queueByApproverId(userId) {
    return query(approvalQueries.queueForManagerId, [userId]);
  },
  decision(status, nextStep, expenseId) {
    return query(approvalQueries.updateDecision, [status, nextStep, expenseId]);
  },
  breadcrumbs(expenseId) {
    return query(approvalQueries.breadcrumbSteps, [expenseId]);
  }
};
