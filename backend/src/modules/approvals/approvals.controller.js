import { asyncHandler } from "../../utils/asyncHandler.js";
import { approvalsModel } from "./approvals.model.js";
import { notifyUser } from "../../services/notification.service.js";

export const managerQueue = asyncHandler(async (req, res) => {
  const byUser = await approvalsModel.queueByApproverId(req.user.id);
  const byRole = await approvalsModel.queueByRole(req.user.role);
  res.json({ queue: [...byUser.rows, ...byRole.rows] });
});

export const takeAction = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const { action, nextStep } = req.body;
  const status = action === "APPROVE" ? "IN_REVIEW" : "REJECTED";
  const result = await approvalsModel.decision(status, nextStep || 99, expenseId);
  notifyUser(req.user.id, { title: `Expense ${expenseId} ${action.toLowerCase()}` });
  res.json({ expense: result.rows[0] });
});

export const breadcrumb = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;
  const result = await approvalsModel.breadcrumbs(expenseId);
  res.json({ steps: result.rows });
});
