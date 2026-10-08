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
        <Link to="/create" className="sidebar-cta">New post</Link>
      )}

      <NavLink to="/" end className="sidebar-link">Home</NavLink>
      <NavLink to="/feed" className="sidebar-link">Feed</NavLink>
      <NavLink to="/about" className="sidebar-link">About</NavLink>

      {user && (
        <>
          <NavLink to="/my-posts" className="sidebar-link">My posts</NavLink>
        </>
      )}

      {user && (
        <div className="sidebar-foot">
          <span className="sidebar-foot-email">{user.email}</span>
          <button onClick={handleLogout} className="btn btn-ghost btn-block">Log out</button>
        </div>
      )}
    </aside>
  );
}