import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Home", num: "01", end: true },
  { to: "/feed", label: "Feed", num: "02" },
  { to: "/about", label: "About", num: "03" },
];

export function NavLinks({ onNavigate }) {
  const { user } = useAuth();
  return (
    <>
      <p className="sidebar-label">Index</p>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className="sidebar-link"
          onClick={onNavigate}
        >
          <span className="sidebar-link-num">{item.num}</span> {item.label}
        </NavLink>
      ))}
      {user && (
        <NavLink to="/my-posts" className="sidebar-link" onClick={onNavigate}>
          <span className="sidebar-link-num">04</span> My entries
        </NavLink>
      )}
    </>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <button
            className="navbar-burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          <Link to="/" className="navbar-brand">Leafy</Link>

          <div className="navbar-auth">
            {user ? (
              <span className="navbar-user">{user.email}</span>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Log in</Link>
                <Link to="/register" className="btn btn-primary">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)}>
          <aside className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <MobileDrawerContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

function MobileDrawerContent({ onClose }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    onClose();
    navigate("/", { replace: true });
  }

  return (
    <>
      {user && (
        <Link to="/create" className="sidebar-cta" onClick={onClose}>
          New entry
        </Link>
      )}

      <NavLinks onNavigate={onClose} />

      <div className="mobile-drawer-foot">
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
            <Link to="/login" className="btn btn-ghost btn-block" onClick={onClose}>
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-block" onClick={onClose}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </>
  );
}