import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <aside className="sidebar">
      {user && (
        <Link to="/create" className="sidebar-cta">
          New entry
        </Link>
      )}

      <p className="sidebar-label">Index</p>

      <NavLink to="/" end className="sidebar-link">
        <span className="sidebar-link-num">01</span> Home
      </NavLink>
      <NavLink to="/feed" className="sidebar-link">
        <span className="sidebar-link-num">02</span> Feed
      </NavLink>
      <NavLink to="/about" className="sidebar-link">
        <span className="sidebar-link-num">03</span> About
      </NavLink>
      {user && (
        <NavLink to="/my-posts" className="sidebar-link">
          <span className="sidebar-link-num">04</span> My entries
        </NavLink>
      )}

      {user && (
        <div className="sidebar-foot">
          <span className="sidebar-label" style={{ margin: "0 0 6px" }}>
            Account
          </span>
          <span className="sidebar-foot-email">{user.email}</span>
          <button onClick={handleLogout} className="btn btn-ghost btn-block">
            Log out
          </button>
        </div>
      )}
    </aside>
  );
}