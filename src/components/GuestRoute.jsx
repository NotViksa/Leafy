import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading...</div>;
  if (user) return <Navigate to="/" replace />;

  return children;
}