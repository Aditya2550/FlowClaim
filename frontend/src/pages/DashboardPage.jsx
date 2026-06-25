import { useAuthContext } from "../context/AuthContext.jsx";
import EmployeeDashboard from "../features/expense/components/EmployeeDashboard.jsx";
import ManagerDashboard from "../features/approval/components/ManagerDashboard.jsx";
import AdminDashboard from "../features/analytics/components/AdminDashboard.jsx";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const role = user?.role || "EMPLOYEE";

  if (role === "MANAGER") return <ManagerDashboard />;
  if (role === "ADMIN") return <AdminDashboard />;
  return <EmployeeDashboard />;
}
