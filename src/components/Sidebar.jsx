import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NavLinks } from "./Navbar";

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <aside className="sidebar">
      {user ? (
        <Link to="/create" className="sidebar-cta">New entry</Link>
      ) : (
        <Link to="/register" className="sidebar-cta">Join the community</Link>
      )}

      <NavLinks />

      <div className="sidebar-foot">
        {user ? (
          <>
            <span className="sidebar-label">Account</span>
            <span className="sidebar-foot-email">{user.email}</span>
            <button onClick={handleLogout} className="btn btn-ghost btn-block">
              Log out
            </button>
          </>
        ) : (
          <>
            <span className="sidebar-label">Account</span>
            <Link to="/login" className="btn btn-ghost btn-block">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-block">Sign up</Link>
          </>
        )}
      </div>
    </aside>
  );
}