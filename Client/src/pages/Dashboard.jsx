import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminBg from "../assets/adminBg.png";
import adminLogout from "../utils/adminLogout";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    products: 0,
    collections: 0,
    projects: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("nova_admin_token");
    localStorage.removeItem("nova_admin");

    navigate("/admin/login", {
      replace: true,
    });
  };

  // ==========================================
  // LOAD DASHBOARD STATISTICS
  // ==========================================
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoadingStats(true);
        setStatsError("");

        const token = localStorage.getItem("nova_admin_token");

        if (!token) {
          setStatsError("Authentication required.");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/dashboard/stats`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load dashboard statistics"
          );
        }

        setStats({
          products: result.data.products ?? 0,
          collections: result.data.collections ?? 0,
          projects: result.data.projects ?? 0,
        });
      } catch (error) {
        console.error(
          "Dashboard statistics error:",
          error
        );

        setStatsError(
          error.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="admin-layout">
      {/* =================================================
          MOBILE OVERLAY
          ================================================= */}
      {menuOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={closeMenu}
        />
      )}

      {/* =================================================
          SIDEBAR
          ================================================= */}
      <aside
        className={`admin-sidebar ${
          menuOpen
            ? "admin-sidebar--mobile-open"
            : ""
        }`}
      >
        <div className="admin-sidebar__top">
          {/* Mobile Sidebar Header */}
          <div className="admin-sidebar__mobile-header">
            <div className="admin-sidebar__logo">
              <h1>NOVA</h1>
              <span>FLOORING STUDIO</span>
            </div>

            <button
              type="button"
              className="admin-sidebar__close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          {/* Desktop Logo */}
          <div
            className="
              admin-sidebar__logo
              admin-sidebar__desktop-logo
            "
          >
            <h1>NOVA</h1>
            <span>FLOORING STUDIO</span>
          </div>

          {/* Navigation */}
          <nav className="admin-sidebar__nav">
            {/* Dashboard */}
            <Link
              to="/admin/dashboard"
              className="admin-sidebar__item active"
              onClick={closeMenu}
            >
              <span className="admin-sidebar__icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 10.5 12 3l9 7.5" />
                  <path d="M5 9.5V21h14V9.5" />
                  <path d="M9 21v-7h6v7" />
                </svg>
              </span>

              <span>Dashboard</span>
            </Link>

            {/* Projects */}
            <Link
              to="/admin/projects"
              className="admin-sidebar__item"
              onClick={closeMenu}
            >
              <span className="admin-sidebar__icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="15"
                    rx="2"
                  />
                  <path d="M8 5V3h8v2" />
                  <path d="M8 12h8" />
                </svg>
              </span>

              <span>Projects</span>
            </Link>

            {/* Collections */}
            <Link
              to="/admin/collections"
              className="admin-sidebar__item"
              onClick={closeMenu}
            >
              <span className="admin-sidebar__icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="4"
                    y="4"
                    width="6"
                    height="6"
                    rx="1"
                  />
                  <rect
                    x="14"
                    y="4"
                    width="6"
                    height="6"
                    rx="1"
                  />
                  <rect
                    x="4"
                    y="14"
                    width="6"
                    height="6"
                    rx="1"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="6"
                    height="6"
                    rx="1"
                  />
                </svg>
              </span>

              <span>Collections</span>
            </Link>

            {/* Inquiries */}
            <Link
              to="/admin/inquiries"
              className="admin-sidebar__item"
              onClick={closeMenu}
            >
              <span className="admin-sidebar__icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>

              <span>Inquiries</span>
            </Link>
          </nav>
        </div>

        {/* =================================================
            SIDEBAR BOTTOM
            ================================================= */}
        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__divider" />

    

          {/* Logout */}
          <button
            type="button"
            className="
              admin-sidebar__item
              admin-sidebar__logout
            "
            onClick={handleLogout}
          >
            <span className="admin-sidebar__icon">
              <svg viewBox="0 0 24 24">
                <path d="M10 5H5v14h5" />
                <path d="M13 8l4 4-4 4" />
                <path d="M8 12h9" />
              </svg>
            </span>

            <span>Logout</span>
          </button>

          <div className="admin-sidebar__tagline">
            <span>FLOORS</span>
            <span>SPACES</span>
            <span>BETTER LIVING</span>
          </div>
        </div>
      </aside>

      {/* =================================================
          MAIN
          ================================================= */}
      <main
        className="admin-main"
        style={{
          "--dashboard-bg": `url(${adminBg})`,
        }}
      >
        {/* =================================================
            TOPBAR
            ================================================= */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              type="button"
              className="admin-topbar__menu"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>

            <div className="admin-topbar__separator" />

            <div>
              <h3>Welcome back, Admin</h3>

              <p>
                Manage your projects, collections and more
              </p>
            </div>
          </div>

          <div className="admin-topbar__profile">
            <div className="admin-topbar__avatar">
              A
            </div>

            <span>Admin</span>

            <svg viewBox="0 0 24 24">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </div>
        </header>

        {/* =================================================
            DASHBOARD
            ================================================= */}
        <div className="admin-dashboard">
          <div className="admin-dashboard__heading">
            <div>
              <h1>Dashboard</h1>
              <p>OVERVIEW</p>
            </div>

            <span>
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>
          </div>

          {/* =================================================
              ERROR
              ================================================= */}
          {statsError && (
            <div className="admin-dashboard__error">
              {statsError}
            </div>
          )}

          {/* =================================================
              STATS
              ================================================= */}
          <section className="admin-stats">
            {/* PRODUCTS */}
            <Link
              to="/admin/collections"
              className="admin-stat-card"
            >
              <div className="admin-stat-card__icon">
                <svg viewBox="0 0 24 24">
                  <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                  <path d="m4 7.5 8 4.5 8-4.5" />
                  <path d="M12 12v9" />
                </svg>
              </div>

              <div className="admin-stat-card__content">
                <p>Total Products</p>

                <strong>
                  {loadingStats
                    ? "—"
                    : stats.products}
                </strong>
              </div>

              <span className="admin-stat-card__arrow">
                →
              </span>
            </Link>

            {/* COLLECTIONS */}
            <Link
              to="/admin/collections"
              className="admin-stat-card"
            >
              <div className="admin-stat-card__icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                  <path d="M8 4v3" />
                  <path d="M16 9v3" />
                  <path d="M10 14v3" />
                </svg>
              </div>

              <div className="admin-stat-card__content">
                <p>Total Collections</p>

                <strong>
                  {loadingStats
                    ? "—"
                    : stats.collections}
                </strong>
              </div>

              <span className="admin-stat-card__arrow">
                →
              </span>
            </Link>

            {/* PROJECTS */}
            <Link
              to="/admin/projects"
              className="admin-stat-card"
            >
              <div className="admin-stat-card__icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 7h6l2 2h10v10H3z" />
                  <path d="M3 7V5h7l2 2" />
                </svg>
              </div>

              <div className="admin-stat-card__content">
                <p>Total Projects</p>

                <strong>
                  {loadingStats
                    ? "—"
                    : stats.projects}
                </strong>
              </div>

              <span className="admin-stat-card__arrow">
                →
              </span>
            </Link>
          </section>

          {/* =================================================
              HERO
              ================================================= */}
          <section className="admin-dashboard__hero">
            <div className="admin-dashboard__hero-overlay" />

            <div className="admin-dashboard__hero-content">
              <div className="admin-dashboard__hero-small">
                <span>NOVA FLOORING STUDIO</span>

                <i />
              </div>

              <h2>
                Outstanding
                <br />
                Spaces Begin Here
              </h2>

              <p>
                FLOORS&nbsp;&nbsp;|&nbsp;&nbsp;
                SPACES&nbsp;&nbsp;|&nbsp;&nbsp;
                BETTER LIVING
              </p>
            </div>
          </section>

          {/* =================================================
              FOOTER
              ================================================= */}
          <footer className="admin-dashboard__footer">
            <span>
              © 2026 NOVA Flooring Studio.
              All rights reserved.
            </span>

            <span>
              Built on Solid Foundations
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;