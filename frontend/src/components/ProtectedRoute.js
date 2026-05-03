import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ✅ wait until loading done
  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  // ❌ if no user
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}