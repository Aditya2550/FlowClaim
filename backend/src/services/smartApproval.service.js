export function suggestApprovalPath({ amountCompany, managerFirstEnabled }) {
  if (managerFirstEnabled) return ["MANAGER", "FINANCE"];
  if (amountCompany > 100000) return ["MANAGER", "FINANCE", "ADMIN"];
  return ["MANAGER", "FINANCE"];
}
