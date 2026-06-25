import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-3 border-forest-500 border-t-transparent animate-spin" />
          <p className="text-sm text-surface-500 font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user) {
    const allowed = allowedRoles.map((role) => String(role).toLowerCase());
    const current = String(user.role || "").toLowerCase();
    if (!allowed.includes(current)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
