import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import adminLogout from "../utils/adminLogout";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminCollections = () => {
  const navigate = useNavigate();

  /* ============================================
     STATE
     ============================================ */

  const [menuOpen, setMenuOpen] = useState(false);

  const [collections, setCollections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState("All");

  const [openMenu, setOpenMenu] = useState(null);
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
     FETCH COLLECTIONS
     ============================================ */

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "nova_admin_token"
        );

        if (!token) {
          setError("Authentication required.");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/collections`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        if (
          !contentType.includes("application/json")
        ) {
          throw new Error(
            "Collections API is not available. Check your backend route and server."
          );
        }

        const result = await response.json();

        if (response.status === 401) {
          localStorage.removeItem(
            "nova_admin_token"
          );
          localStorage.removeItem("nova_admin");

          navigate("/admin/login", {
            replace: true,
          });

          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load collections."
          );
        }

        setCollections(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Admin collections error:",
          err
        );

        setError(
          err.message ||
            "Unable to load collections."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [navigate]);

  /* ============================================
     DELETE COLLECTION
     ============================================ */

  const handleDeleteCollection = async (
    collection
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${collection.name}"?`
    );

    if (!confirmed) {
      setOpenMenu(null);
      return;
    }

    try {
      setDeletingId(collection._id);
      setError("");

      const token = localStorage.getItem(
        "nova_admin_token"
      );

      if (!token) {
        setError("Authentication required.");

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/collections/${collection._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (
        !contentType.includes("application/json")
      ) {
        throw new Error(
          "Delete API is not available. Check your backend route."
        );
      }

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "nova_admin_token"
        );
        localStorage.removeItem("nova_admin");

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete collection."
        );
      }

      setCollections((prev) =>
        prev.filter(
          (item) =>
            item._id !== collection._id
        )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error(
        "Delete collection error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete collection."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ============================================
     STATISTICS
     ============================================ */

  const stats = useMemo(() => {
    return {
      total: collections.length,

      active: collections.filter(
        (collection) =>
          collection.isActive === true
      ).length,

      inactive: collections.filter(
        (collection) =>
          collection.isActive !== true
      ).length,
    };
  }, [collections]);

  /* ============================================
     SEARCH + FILTER
     ============================================ */

  const filteredCollections = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return collections.filter((collection) => {
      const name =
        collection.name?.toLowerCase() || "";

      const slug =
        collection.slug?.toLowerCase() || "";

      const tagline =
        collection.tagline?.toLowerCase() || "";

      const description =
        collection.description?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        name.includes(query) ||
        slug.includes(query) ||
        tagline.includes(query) ||
        description.includes(query);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Active" &&
          collection.isActive === true) ||
        (activeFilter === "Inactive" &&
          collection.isActive !== true);

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    collections,
    search,
    activeFilter,
  ]);

  /* ============================================
     DATE FORMAT
     ============================================ */

  const formatDate = (date) => {
    if (!date) return "—";

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
     CLOSE CARD MENU
     ============================================ */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(
          ".admin-collection-card__actions"
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

              <span>
                Dashboard
              </span>
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

              <span>
                Projects
              </span>
            </Link>

            {/* Collections */}
            <Link
              to="/admin/collections"
              className="
                admin-sidebar__item
                active
              "
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

            <span>
              Logout
            </span>
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
        {/* =======================================
            TOPBAR
            ======================================= */}

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
                Manage your flooring
                collections.
              </p>
            </div>
          </div>

          <div className="admin-topbar__profile">
            <div className="admin-topbar__avatar">
              A
            </div>

            <span>
              Admin
            </span>

            <svg viewBox="0 0 24 24">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </div>
        </header>

        {/* =======================================
            COLLECTION CONTENT
            ======================================= */}

        <div className="admin-collections">
          {/* =====================================
              HEADING
              ===================================== */}

          <section className="admin-collections__heading">
            <div>
              <h1>
                Collections
              </h1>

              <p>
                MANAGE YOUR FLOORING RANGES
              </p>
            </div>

            <button
              type="button"
              className="admin-collections__add-btn"
              onClick={() =>
                navigate(
                  "/admin/collections/add"
                )
              }
            >
              <span>+</span>
              Add Collection
            </button>
          </section>

          {/* =====================================
              ERROR
              ===================================== */}

          {error && (
            <div className="admin-dashboard__error">
              {error}
            </div>
          )}

          {/* =====================================
              TOOLBAR
              ===================================== */}

          <section className="admin-collections__toolbar">
            {/* Search */}
            <div className="admin-collections__search">
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
                placeholder="Search collections..."
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
              className="admin-collections__filter"
              value={activeFilter}
              onChange={(e) =>
                setActiveFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Collections
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

            {/* Add Collection */}
            <button
              type="button"
              className="
                admin-collections__add-btn
                admin-collections__add-btn--desktop
              "
              onClick={() =>
                navigate(
                  "/admin/collections/add"
                )
              }
            >
              <span>+</span>
              Add Collection
            </button>
          </section>

          {/* =====================================
              STATISTICS
              ===================================== */}

          <section className="admin-collections__stats">
            {/* Total */}
            <div className="admin-collections__stat-card">
              <div className="admin-collections__stat-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 5h16v14H4z" />
                  <path d="M8 5V3h8v2" />
                </svg>
              </div>

              <div>
                <strong>
                  {loading
                    ? "—"
                    : stats.total}
                </strong>

                <span>
                  Total Collections
                </span>
              </div>
            </div>

            {/* Active */}
            <div className="admin-collections__stat-card">
              <div
                className="
                  admin-collections__stat-icon
                  admin-collections__stat-icon--green
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
            <div className="admin-collections__stat-card">
              <div
                className="
                  admin-collections__stat-icon
                  admin-collections__stat-icon--gray
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
          </section>

          {/* =====================================
              COLLECTION LIST
              ===================================== */}

          {loading ? (
            <div className="admin-collections__loading">
              Loading collections...
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="admin-collections__empty">
              <h3>
                No collections found
              </h3>

              <p>
                {search ||
                activeFilter !== "All"
                  ? "Try changing your search or filter."
                  : "Add your first collection to get started."}
              </p>

              {!search &&
                activeFilter === "All" && (
                  <button
                    type="button"
                    className="admin-collections__empty-btn"
                    onClick={() =>
                      navigate(
                        "/admin/collections/add"
                      )
                    }
                  >
                    + Add Collection
                  </button>
                )}
            </div>
          ) : (
            <section className="admin-collections__grid">
              {filteredCollections.map(
                (collection) => (
                  <article
                    key={collection._id}
                    className="admin-collection-card"
                    onClick={() =>
                      navigate(
                        `/admin/collections/${collection._id}`
                      )
                    }
                  >
                    {/* =================================
                        IMAGE
                        ================================= */}

                    <div className="admin-collection-card__image">
                      {collection.imageUrl ? (
                        <img
                          src={collection.imageUrl}
                          alt={
                            collection.name ||
                            "Collection"
                          }
                        />
                      ) : (
                        <div className="admin-collection-card__no-image">
                          <span>
                            NOVA
                          </span>
                        </div>
                      )}

                      {/* ACTIVE STATUS */}
                      <span
                        className={`admin-collection-card__status ${
                          collection.isActive
                            ? "published"
                            : "draft"
                        }`}
                      >
                        {collection.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                      {/* THREE DOT MENU */}
                      <div className="admin-collection-card__actions">
                        <button
                          type="button"
                          className="admin-collection-card__menu"
                          aria-label={`Options for ${
                            collection.name ||
                            "collection"
                          }`}
                          disabled={
                            deletingId ===
                            collection._id
                          }
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              (prev) =>
                                prev ===
                                collection._id
                                  ? null
                                  : collection._id
                            );
                          }}
                        >
                          ⋮
                        </button>

                        {openMenu ===
                          collection._id && (
                          <div className="admin-collection-card__menu-dropdown">
                            {/* View */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                setOpenMenu(null);

                                navigate(
                                  `/admin/collections/${collection._id}`
                                );
                              }}
                            >
                              View Collection
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="admin-collection-card__delete-action"
                              disabled={
                                deletingId ===
                                collection._id
                              }
                              onClick={(e) => {
                                e.stopPropagation();

                                handleDeleteCollection(
                                  collection
                                );
                              }}
                            >
                              {deletingId ===
                              collection._id
                                ? "Deleting..."
                                : "Delete Collection"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* =================================
                        DETAILS
                        ================================= */}

                    <div className="admin-collection-card__body">
                      <h3>
                        {collection.name ||
                          "Untitled Collection"}
                      </h3>

                      {/* Tagline */}
                      {collection.tagline && (
                        <p>
                          {collection.tagline}
                        </p>
                      )}

                      {/* Number */}
                      {collection.number && (
                        <span className="admin-collection-card__products">
                          Collection{" "}
                          {collection.number}
                        </span>
                      )}

                      {/* Footer */}
                      <div className="admin-collection-card__footer">
                        <span>
                          {formatDate(
                            collection.createdAt
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

export default AdminCollections;