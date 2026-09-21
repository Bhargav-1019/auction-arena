import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// requireAuth=true  → page needs login
// requireAuth=false → page is only for guests (login/signup)
export default function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-cyan-400/70 text-sm tracking-widest uppercase">
            Connecting to Arena…
          </p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return <Navigate to="/login" replace />;
  if (!requireAuth && isAuthenticated) return <Navigate to="/home" replace />;

  return children;
}
