import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout.jsx";
import ProtectedRoute from "../components/layout/ProtectedRoute.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ExpensePage from "../pages/ExpensePage.jsx";
import ApprovalQueuePage from "../pages/ApprovalQueuePage.jsx";
import AnalyticsPage from "../pages/AnalyticsPage.jsx";
import AdminPanelPage from "../pages/AdminPanelPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import UnauthorizedPage from "../pages/UnauthorizedPage.jsx";

function RoleHomeRedirect() {
  const { user } = useAuth();
  const role = String(user?.role || "").toLowerCase();

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "manager") return <Navigate to="/manager" replace />;
  if (role === "finance") return <Navigate to="/manager" replace />;
  if (role === "director") return <Navigate to="/manager" replace />;
  if (role === "employee") return <Navigate to="/employee" replace />;
  return <Navigate to="/login" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<RoleHomeRedirect />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager", "finance", "director", "admin"]}>
              <ApprovalQueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee", "admin"]}>
              <ExpensePage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route
          path="/approvals"
          element={
            <ProtectedRoute
              allowedRoles={["manager", "finance", "director", "admin"]}
            >
              <ApprovalQueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
