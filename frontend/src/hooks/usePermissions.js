export function usePermissions(role = "EMPLOYEE") {
    return {
        canViewAllExpenses: role === "ADMIN" || role === "MANAGER",
        canOverrideApprovals: role === "ADMIN",
        canSwitchRoles: role === "ADMIN"
    };
}
