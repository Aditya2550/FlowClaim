import { Link } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100">
      <div className="text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="font-manrope font-bold text-2xl text-forest-900 mb-2">
          Access Denied
        </h2>
        <p className="text-surface-500 text-sm mb-8 max-w-sm mx-auto">
          You don't have permission to view this page. Please contact your
          administrator if you believe this is an error.
        </p>
        <button
          onClick={() => {
            localStorage.clear();
            logout();
          }}
          className="btn-neon inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Logout & Back to Login
        </button>
      </div>
    </div>
  );
}
