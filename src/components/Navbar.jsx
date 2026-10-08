import { useEffect, useRef, useState } from "react";
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
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);

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

  const dateStamp = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <header className={`navbar ${hidden && !open ? "navbar-hidden" : ""}`}>
        <div className="navbar-inner">
          <button
            className="navbar-burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          <Link to="/" className="navbar-brand">
            <span className="navbar-brand-mark">
              <SprigMark size={20} />
            </span>
            <span className="navbar-brand-text">
              <span className="navbar-brand-word">Leafy</span>
              <em className="navbar-brand-tag">Field Notes</em>
            </span>
          </Link>

          <div className="navbar-stamp" aria-hidden="true">
            Vol. 01 · {dateStamp}
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