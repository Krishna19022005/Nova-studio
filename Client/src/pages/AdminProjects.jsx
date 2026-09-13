import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import adminLogout from "../utils/adminLogout";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminProjects = () => {
  const navigate = useNavigate();

  /* ============================================
     STATE
     ============================================ */

  const [menuOpen, setMenuOpen] = useState(false);

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Project three-dot menu
  const [openMenu, setOpenMenu] = useState(null);

  // Project currently being deleted
  const [deletingId, setDeletingId] = useState(null);

  /* ============================================
     MOBILE MENU
     ============================================ */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* ============================================
     AUTHENTICATED REQUEST HEADERS
     ============================================ */

  const getAuthHeaders = () => {
    const token = localStorage.getItem("nova_admin_token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  /* ============================================
     FETCH PROJECTS
     ============================================ */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "nova_admin_token"
        );

        if (!token) {
          setError("Authentication required.");
          navigate("/admin/login", { replace: true });
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/projects`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("nova_admin_token");
          localStorage.removeItem("nova_admin");
          navigate("/admin/login", { replace: true });
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load projects."
          );
        }

        setProjects(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Admin projects error:",
          err
        );

        setError(
          err.message ||
            "Unable to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  /* ============================================
     DELETE PROJECT
     ============================================ */

  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) {
      setOpenMenu(null);
      return;
    }

    try {
      setDeletingId(project._id);
      setError("");

      const token = localStorage.getItem(
        "nova_admin_token"
      );

      if (!token) {
        setError("Authentication required.");
        navigate("/admin/login", { replace: true });
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/projects/${project._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("nova_admin_token");
        localStorage.removeItem("nova_admin");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete project."
        );
      }

      // Remove deleted project immediately
      setProjects((prev) =>
        prev.filter(
          (item) => item._id !== project._id
        )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error(
        "Delete project error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ============================================
     STATISTICS
     ============================================ */

  const stats = useMemo(() => {
    const categories = new Set(
      projects
        .map((project) => project.category)
        .filter(Boolean)
    );

    return {
      total: projects.length,

      active: projects.filter(
        (project) =>
          project.isActive === true
      ).length,

      inactive: projects.filter(
        (project) =>
          project.isActive !== true
      ).length,

      categories: categories.size,
    };
  }, [projects]);

  /* ============================================
     SEARCH + FILTER
     ============================================ */

  const filteredProjects = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return projects.filter((project) => {
      const name =
        project.name?.toLowerCase() || "";

      const location =
        project.location?.toLowerCase() || "";

      const category =
        project.category?.toLowerCase() || "";

      const projectType =
        project.projectType?.toLowerCase() || "";

      const description =
        project.description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        name.includes(query) ||
        location.includes(query) ||
        category.includes(query) ||
        projectType.includes(query) ||
        description.includes(query);

      const matchesActive =
        activeFilter === "All" ||
        (activeFilter === "Active" &&
          project.isActive === true) ||
        (activeFilter === "Inactive" &&
          project.isActive !== true);

      return (
        matchesSearch &&
        matchesActive
      );
    });
  }, [
    projects,
    search,
    activeFilter,
  ]);

  /* ============================================
     DATE FORMATTER
     ============================================ */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ============================================
     CLOSE PROJECT MENU
     ============================================ */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(
          ".admin-project-card__actions"
        )
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "click",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "click",
        handleOutsideClick
      );
    };
  }, []);

  /* ============================================
     UI
     ============================================ */

  return (
    <div className="admin-layout">

      {/* =========================================
          MOBILE OVERLAY
          ========================================= */}

      {menuOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={closeMenu}
        />
      )}

      {/* =========================================
          SIDEBAR
          ========================================= */}

      <aside
        className={`admin-sidebar ${
          menuOpen
            ? "admin-sidebar--mobile-open"
            : ""
        }`}
      >
        <div className="admin-sidebar__top">

          {/* Mobile Header */}
          <div className="admin-sidebar__mobile-header">
            <div className="admin-sidebar__logo">
              <h1>NOVA</h1>

              <span>
                FLOORING STUDIO
              </span>
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

            <span>
              FLOORING STUDIO
            </span>
          </div>

          {/* Navigation */}
          <nav className="admin-sidebar__nav">

            {/* Dashboard */}
            <Link
              to="/admin/dashboard"
              className="admin-sidebar__item"
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
              className="
                admin-sidebar__item
                active
              "
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

              <span>
                Collections
              </span>
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

              <span>
                Inquiries
              </span>
            </Link>

          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div className="admin-sidebar__bottom">

          <div className="admin-sidebar__divider" />
{/* Logout */}
          <button
            type="button"
            className="
              admin-sidebar__item
              admin-sidebar__logout
            "
            onClick={adminLogout}
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
            <span>
              BETTER LIVING
            </span>
          </div>

        </div>
      </aside>

      {/* =========================================
          MAIN
          ========================================= */}

      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">

          <div className="admin-topbar__left">

            <button
              type="button"
              className="admin-topbar__menu"
              onClick={() =>
                setMenuOpen(true)
              }
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>

            <div className="admin-topbar__separator" />

            <div>
              <h3>
                Welcome back, Admin
              </h3>

              <p>
                Manage your projects,
                showcase your work to
                the world.
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

        {/* =========================================
            PROJECT CONTENT
            ========================================= */}

        <div className="admin-projects">

          {/* Heading */}
          <section className="admin-projects__heading">

            <div>
              <h1>Projects</h1>

              <p>
                SHOWCASE YOUR WORK
              </p>
            </div>

            <button
              type="button"
              className="admin-projects__add-btn"
              onClick={() =>
                navigate(
                  "/admin/projects/add"
                )
              }
            >
              <span>+</span>
              Add Project
            </button>

          </section>

          {/* Error */}
          {error && (
            <div className="admin-dashboard__error">
              {error}
            </div>
          )}

          {/* =======================================
              TOOLBAR
              ======================================= */}

          <section className="admin-projects__toolbar">

            {/* Search */}
            <div className="admin-projects__search">

              <svg viewBox="0 0 24 24">
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                />

                <path d="m16 16 5 5" />
              </svg>

              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* Filter */}
            <select
              className="admin-projects__filter"
              value={activeFilter}
              onChange={(e) =>
                setActiveFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Projects
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

            {/* Add Project */}
            <button
              type="button"
              className="
                admin-projects__add-btn
                admin-projects__add-btn--desktop
              "
              onClick={() =>
                navigate(
                  "/admin/projects/add"
                )
              }
            >
              <span>+</span>
              Add Project
            </button>

          </section>

          {/* =======================================
              STATISTICS
              ======================================= */}

          <section className="admin-projects__stats">

            {/* Total */}
            <div className="admin-projects__stat-card">

              <div className="admin-projects__stat-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3 7h6l2 2h10v10H3z" />
                  <path d="M3 7V5h7l2 2" />
                </svg>
              </div>

              <div>
                <strong>
                  {loading
                    ? "—"
                    : stats.total}
                </strong>

                <span>
                  Total Projects
                </span>
              </div>

            </div>

            {/* Active */}
            <div className="admin-projects__stat-card">

              <div
                className="
                  admin-projects__stat-icon
                  admin-projects__stat-icon--green
                "
              >
                <span />
              </div>

              <div>
                <strong>
                  {loading
                    ? "—"
                    : stats.active}
                </strong>

                <span>
                  Active
                </span>
              </div>

            </div>

            {/* Inactive */}
            <div className="admin-projects__stat-card">

              <div
                className="
                  admin-projects__stat-icon
                  admin-projects__stat-icon--gray
                "
              >
                <svg viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                  />

                  <path d="M8 8l8 8" />
                  <path d="M16 8l-8 8" />
                </svg>
              </div>

              <div>
                <strong>
                  {loading
                    ? "—"
                    : stats.inactive}
                </strong>

                <span>
                  Inactive
                </span>
              </div>

            </div>

            {/* Categories */}
            <div className="admin-projects__stat-card">

              <div
                className="
                  admin-projects__stat-icon
                  admin-projects__stat-icon--gold
                "
              >
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
              </div>

              <div>
                <strong>
                  {loading
                    ? "—"
                    : stats.categories}
                </strong>

                <span>
                  Categories
                </span>
              </div>

            </div>

          </section>

          {/* =======================================
              PROJECT LIST
              ======================================= */}

          {loading ? (
            <div className="admin-projects__loading">
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="admin-projects__empty">

              <h3>
                No projects found
              </h3>

              <p>
                {search ||
                activeFilter !== "All"
                  ? "Try changing your search or filter."
                  : "Add your first project to get started."}
              </p>

              {!search &&
                activeFilter === "All" && (
                  <button
                    type="button"
                    className="admin-projects__empty-btn"
                    onClick={() =>
                      navigate(
                        "/admin/projects/add"
                      )
                    }
                  >
                    + Add Project
                  </button>
                )}

            </div>
          ) : (
            <section className="admin-projects__grid">

              {filteredProjects.map(
                (project) => (
                  <article
                    key={project._id}
                    className="admin-project-card"
                  >

                    {/* =================================
                        PROJECT IMAGE
                        ================================= */}

                    <div className="admin-project-card__image">

                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={
                            project.name ||
                            "Project"
                          }
                        />
                      ) : (
                        <div className="admin-project-card__no-image">
                          <span>
                            NOVA
                          </span>
                        </div>
                      )}

                      {/* Active Status */}
                      <span
                        className={`admin-project-card__status ${
                          project.isActive
                            ? "published"
                            : "draft"
                        }`}
                      >
                        {project.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                      {/* =========================
                          THREE DOT ACTION MENU
                          ========================= */}

                      <div className="admin-project-card__actions">

                        <button
                          type="button"
                          className="admin-project-card__menu"
                          aria-label={`Options for ${
                            project.name ||
                            "project"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              (prev) =>
                                prev ===
                                project._id
                                  ? null
                                  : project._id
                            );
                          }}
                          disabled={
                            deletingId ===
                            project._id
                          }
                        >
                          ⋮
                        </button>

                        {openMenu ===
                          project._id && (
                          <div className="admin-project-card__menu-dropdown">

                            {/* Delete */}
                            <button
                              type="button"
                              className="
                                admin-project-card__menu-item
                                admin-project-card__menu-item--delete
                              "
                              onClick={() =>
                                handleDeleteProject(
                                  project
                                )
                              }
                              disabled={
                                deletingId ===
                                project._id
                              }
                            >
                              <svg viewBox="0 0 24 24">
                                <path d="M4 7h16" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M6 7l1 14h10l1-14" />
                                <path d="M9 7V4h6v3" />
                              </svg>

                              <span>
                                {deletingId ===
                                project._id
                                  ? "Deleting..."
                                  : "Delete Project"}
                              </span>
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                    {/* =================================
                        PROJECT DETAILS
                        ================================= */}

                    <div className="admin-project-card__body">

                      <h3>
                        {project.name ||
                          "Untitled Project"}
                      </h3>

                      {/* Category */}
                      {project.category && (
                        <div className="admin-project-card__category">
                          {project.category}
                        </div>
                      )}

                      {/* Location */}
                      {project.location && (
                        <div className="admin-project-card__location">

                          <svg viewBox="0 0 24 24">
                            <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />

                            <circle
                              cx="12"
                              cy="9"
                              r="2.2"
                            />
                          </svg>

                          <span>
                            {project.location}
                          </span>

                        </div>
                      )}

                      {/* Project Type */}
                      {project.projectType && (
                        <p className="admin-project-card__type">
                          {project.projectType}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="admin-project-card__footer">

                        <span>
                          {formatDate(
                            project.createdAt
                          )}
                        </span>

                        <span>
                          →
                        </span>

                      </div>

                    </div>

                  </article>
                )
              )}

            </section>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminProjects;