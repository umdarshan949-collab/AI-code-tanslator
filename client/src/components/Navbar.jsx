import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.js";
import { logout as logoutAPI } from "../services/authService.js";
import toast from "react-hot-toast";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try { await logoutAPI(); } catch { /* ignore */ }
    logout();
    navigate("/login");
    toast.success("Logged out successfully.");
    setOpen(false);
  };

  const close = () => setOpen(false);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo" onClick={close}>Code Translator</Link>

        {/* Desktop nav */}
        <div className="navbar-links">
          <Link to="/"       className={`nav-link ${isActive("/")        ? "nav-link--active" : ""}`}>Editor</Link>
          <Link to="/history" className={`nav-link ${isActive("/history") ? "nav-link--active" : ""}`}>History</Link>
        </div>

        {/* Desktop user */}
        <div className="navbar-user">
          {user?.picture && <img src={user.picture} alt={user.name} className="navbar-avatar" />}
          <span className="navbar-name">{user?.name}</span>
          <button className="navbar-logout" onClick={handleLogout}>Logout</button>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className={`hamburger ${open ? "hamburger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}>
        <Link to="/"        className={`mob-link ${isActive("/")        ? "mob-link--active" : ""}`} onClick={close}>Editor</Link>
        <Link to="/history" className={`mob-link ${isActive("/history") ? "mob-link--active" : ""}`} onClick={close}>History</Link>
        <div className="mob-divider" />
        <div className="mob-user">
          {user?.picture && <img src={user.picture} alt={user.name} className="navbar-avatar" />}
          <span className="navbar-name">{user?.name}</span>
        </div>
        <button className="mob-logout" onClick={handleLogout}>Logout</button>
      </div>

      <style>{`
        .navbar {
          height: var(--nav-h, 56px);
          background: #141414;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 200;
        }
        .navbar-logo {
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          flex-shrink: 0;
        }
        .navbar-links { display: flex; gap: 4px; }
        .nav-link {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          text-decoration: none;
          color: #888;
          background: transparent;
          transition: all .2s;
        }
        .nav-link:hover { color: #fff; background: #2a2a2a; }
        .nav-link--active { color: #fff; background: #2a2a2a; }

        .navbar-user { display: flex; align-items: center; gap: 12px; }
        .navbar-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .navbar-name { font-size: 13px; color: #aaa; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .navbar-logout {
          padding: 5px 14px;
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
          transition: all .2s;
          white-space: nowrap;
        }
        .navbar-logout:hover { border-color: #555; color: #fff; }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
        }
        .hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #aaa;
          border-radius: 2px;
          transition: all .25s;
          transform-origin: center;
        }
        .hamburger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger--open span:nth-child(2) { opacity: 0; }
        .hamburger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: #141414;
          border-bottom: 1px solid #2a2a2a;
          padding: 10px;
          position: sticky;
          top: var(--nav-h, 56px);
          z-index: 199;
        }
        .mobile-menu--open { display: flex; }
        .mob-link {
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 14px;
          text-decoration: none;
          color: #888;
          transition: all .2s;
        }
        .mob-link:hover { color: #fff; background: #1e1e1e; }
        .mob-link--active { color: #fff; background: #2a2a2a; }
        .mob-divider { height: 1px; background: #2a2a2a; margin: 8px 0; }
        .mob-user { display: flex; align-items: center; gap: 10px; padding: 8px 14px; }
        .mob-logout {
          margin-top: 4px;
          padding: 12px 14px;
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
          transition: all .2s;
        }
        .mob-logout:hover { border-color: #e55; color: #e55; }

        @media (max-width: 640px) {
          .navbar-links,
          .navbar-user  { display: none; }
          .hamburger    { display: flex; }
        }
      `}</style>
    </>
  );
}

export default Navbar;