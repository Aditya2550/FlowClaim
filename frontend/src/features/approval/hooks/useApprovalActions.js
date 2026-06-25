import { approvalActionApi } from "../services/approval.api.js";

export async function useApprovalAction(expenseId, action) {
    return approvalActionApi(expenseId, { action, nextStep: action === "APPROVE" ? 2 : 99 });
}
