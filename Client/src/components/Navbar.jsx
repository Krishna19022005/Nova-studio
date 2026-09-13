import { useState } from "react";
import {
  Menu,
  Search,
  X,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { label: "HOME", to: "/" },
    { label: "COLLECTIONS", to: "/collections" },
    { label: "PROJECTS", to: "/projects" },
    { label: "ABOUT", to: "/about" },
    { label: "MATERIALS", to: "/materials" },
    { label: "CONTACT", to: "/contact" },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="nova-navbar">
      <div className="nova-navbar-inner">

        {/* =========================
            LOGO
        ========================== */}
        <Link
          to="/"
          className="nova-logo"
          onClick={closeMenu}
          aria-label="NOVA Flooring Studio"
        >
          <span className="nova-logo-mark">
            NS
          </span>

          <span className="nova-logo-copy">
            <strong>NOVA</strong>
            <small>FLOORING STUDIO</small>
          </span>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <nav className="nova-desktop-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `nova-nav-link ${
                  isActive ? "is-active" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* =========================
            DESKTOP ACTIONS
        ========================== */}
        <div className="nova-navbar-actions">

          <button
            type="button"
            className="nova-search-button"
            aria-label="Search"
          >
            <Search
              size={18}
              strokeWidth={1.25}
            />
          </button>

          <Link
            to="/contact"
            className="nova-navbar-enquire"
            onClick={closeMenu}
          >
            <MessageCircle
              size={16}
              strokeWidth={1.25}
            />

            <span>ENQUIRE</span>
          </Link>

          <Link
            to="/admin/login"
            className="nova-admin-button"
            onClick={closeMenu}
          >
            ADMIN
          </Link>
        </div>

        {/* =========================
            MOBILE ACTIONS
        ========================== */}
        <div className="nova-mobile-actions">

          <a
            href="https://wa.me/919041665532"
            target="_blank"
            rel="noreferrer"
            className="nova-mobile-whatsapp"
            aria-label="WhatsApp"
          >
            <MessageCircle
              size={19}
              strokeWidth={1.25}
            />
          </a>

          <button
            type="button"
            className="nova-menu-button"
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X
                size={23}
                strokeWidth={1.2}
              />
            ) : (
              <Menu
                size={23}
                strokeWidth={1.2}
              />
            )}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}
      <div
        className={`nova-mobile-menu ${
          menuOpen ? "is-open" : ""
        }`}
      >
        <div className="nova-mobile-menu-inner">

          <div className="nova-mobile-menu-brand">
            <span className="nova-logo-mark">
              NS
            </span>

            <span className="nova-logo-copy">
              <strong>NOVA</strong>
              <small>FLOORING STUDIO</small>
            </span>
          </div>

          <nav>
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `nova-mobile-nav-link ${
                    isActive ? "is-active" : ""
                  }`
                }
                onClick={closeMenu}
              >
                <span>{item.label}</span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.2}
                />
              </NavLink>
            ))}
          </nav>

          <div className="nova-mobile-menu-actions">

            <Link
              to="/contact"
              className="nova-mobile-enquire-button"
              onClick={closeMenu}
            >
              <span>ENQUIRE</span>

              <ArrowRight
                size={15}
                strokeWidth={1.2}
              />
            </Link>

            <Link
              to="/admin/login"
              className="nova-mobile-admin-button"
              onClick={closeMenu}
            >
              <span>ADMIN PORTAL</span>

              <ArrowRight
                size={15}
                strokeWidth={1.2}
              />
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;