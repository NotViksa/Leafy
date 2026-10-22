import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { profileName, profileAvatar } from "../lib/profile";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/feed", label: "Feed" },
  { to: "/about", label: "About" },
];

export function NavLinks({ onNavigate }) {
  const { user } = useAuth();
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className="sidebar-link"
          onClick={onNavigate}
        >
          {item.label}
        </NavLink>
      ))}
      {user && (
        <>
          <NavLink to="/my-posts" className="sidebar-link" onClick={onNavigate}>
            My entries
          </NavLink>
          <NavLink to="/profile" className="sidebar-link" onClick={onNavigate}>
            Profile
          </NavLink>
        </>
      )}
    </>
  );
}

function SprigMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    drawerRef.current?.focus();

    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;

      let nextHidden = hiddenRef.current;
      if (y > 120 && y > lastY + 6) nextHidden = true;
      else if (y < lastY - 12 || y < 80) nextHidden = false;

      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden;
        setHidden(nextHidden);
        document.documentElement.dataset.nav = nextHidden ? "hidden" : "visible";
      }

      lastY = y;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`navbar ${hidden && !open ? "navbar-hidden" : ""}`}>
        <div className="navbar-inner">
          <button
            className="navbar-burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>

          <Link to="/" className="navbar-brand">
            <span className="navbar-brand-mark">
              <SprigMark size={20} />
            </span>
            <span className="navbar-brand-word">Leafy</span>
          </Link>
        </div>
      </header>

      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)}>
          <aside
            ref={drawerRef}
            id="mobile-menu"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <MobileDrawerContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

function MobileDrawerContent({ onClose }) {
  const { user, signOut } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    notify("Signed out.");
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
            <Link to="/profile" className="sidebar-account" onClick={onClose}>
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
            <Link to="/login" className="btn btn-ghost btn-block" onClick={onClose}>
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary btn-block" onClick={onClose}>
              Create account
            </Link>
          </>
        )}
      </div>
    </>
  );
}
