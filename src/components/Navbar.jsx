import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🌿 Leafy
        </Link>

        <nav className="navbar-links">
          <NavLink to="/feed">Feed</NavLink>
          <NavLink to="/about">About</NavLink>
          {user && <NavLink to="/my-posts">My posts</NavLink>}
          {user && <NavLink to="/create">New post</NavLink>}
        </nav>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="navbar-user">{user.email}</span>
              <button onClick={handleLogout} className="btn-ghost">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}