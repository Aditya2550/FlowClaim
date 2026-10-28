export function getNotificationLink(item, userRole) {
  const role = String(userRole || "").toLowerCase();
  const expenseId = item?.expense_id || item?.expenseId;

  if (item?.type === "approval_requested") {
    return expenseId ? `/approvals?expense=${expenseId}` : "/approvals";
  }

  if (item?.type === "expense_approved" || item?.type === "expense_rejected") {
    if (role === "employee") {
      return expenseId ? `/my-approvals?expense=${expenseId}` : "/my-approvals";
    }
    return expenseId ? `/approval-history?expense=${expenseId}` : "/approval-history";
  }

  return null;
}

export const NOTIFICATION_LABELS = {
  approval_requested: "Approval needed",
  expense_approved: "Expense approved",
  expense_rejected: "Expense rejected",
};

export function getNotificationLabel(type) {
  return NOTIFICATION_LABELS[type] || "Update";
}
