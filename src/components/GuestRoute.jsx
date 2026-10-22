import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loading">Loading...</div>;
  if (user) {
    const from = location.state?.from;
    const target =
      typeof from === "string" && from.startsWith("/") && !from.startsWith("//")
        ? from
        : "/";
    return <Navigate to={target} replace />;
  }

  return children;
}
