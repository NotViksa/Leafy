import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileName, profileAvatar } from "../lib/profile";
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
            <Link to="/profile" className="sidebar-account">
              <img
                className="avatar avatar-sm"
                src={profileAvatar(user)}
                alt=""
                width="26"
                height="26"
              />
              <span className="sidebar-account-id">
                <span className="sidebar-account-name">
                  {profileName(user)}
                </span>
                <span className="sidebar-foot-email">{user.email}</span>
              </span>
            </Link>
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