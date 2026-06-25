import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100">
      <div className="text-center animate-fade-in">
        <p className="font-manrope font-bold text-8xl text-forest-500 mb-4">404</p>
        <h2 className="font-manrope font-bold text-2xl text-forest-900 mb-2">
          Page not found
        </h2>
        <p className="text-surface-500 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="btn-neon inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
