import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import adminLogout from "../utils/adminLogout";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const AdminInquiries = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [inquiries, setInquiries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  /* ============================================
     MOBILE MENU
  ============================================ */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* ============================================
     AUTH HEADERS
  ============================================ */

  const getAuthHeaders = () => {
    const token = localStorage.getItem(
      "nova_admin_token"
    );

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const redirectToLogin = () => {
    localStorage.removeItem(
      "nova_admin_token"
    );

    localStorage.removeItem(
      "nova_admin"
    );

    navigate("/admin/login", {
      replace: true,
    });
  };

  /* ============================================
     FETCH INQUIRIES
  ============================================ */

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "nova_admin_token"
        );

        if (!token) {
          redirectToLogin();
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/inquiries`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        if (
          !contentType.includes(
            "application/json"
          )
        ) {
          throw new Error(
            "Inquiry API is not available."
          );
        }

        const result =
          await response.json();

        if (response.status === 401) {
          redirectToLogin();
          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to load inquiries."
          );
        }

        setInquiries(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Fetch inquiries error:",
          err
        );

        setError(
          err.message ||
            "Unable to load inquiries."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  /* ============================================
     STATS
  ============================================ */

  const stats = useMemo(() => {
    const total = inquiries.length;

    const newCount = inquiries.filter(
      (item) =>
        item.status === "new"
    ).length;

    const contacted = inquiries.filter(
      (item) =>
        item.status === "contacted"
    ).length;

    const resolved = inquiries.filter(
      (item) =>
        item.status === "resolved"
    ).length;

    return {
      total,
      new: newCount,
      contacted,
      resolved,
    };
  }, [inquiries]);

  /* ============================================
     FILTER
  ============================================ */

  const filteredInquiries = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return inquiries.filter(
      (inquiry) => {
        const name =
          inquiry.name?.toLowerCase() ||
          "";

        const email =
          inquiry.email?.toLowerCase() ||
          "";

        const phone =
          inquiry.phone?.toLowerCase() ||
          "";

        const subject =
          inquiry.subject?.toLowerCase() ||
          "";

        const projectType =
          inquiry.projectType?.toLowerCase() ||
          "";

        const location =
          inquiry.location?.toLowerCase() ||
          "";

        const message =
          inquiry.message?.toLowerCase() ||
          "";

        const matchesSearch =
          !query ||
          name.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          subject.includes(query) ||
          projectType.includes(query) ||
          location.includes(query) ||
          message.includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          inquiry.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    inquiries,
    search,
    statusFilter,
  ]);

  /* ============================================
     STATUS LABEL
  ============================================ */

  const getStatusLabel = (status) => {
    switch (status) {
      case "new":
        return "New";

      case "contacted":
        return "Contacted";

      case "resolved":
        return "Resolved";

      default:
        return "New";
    }
  };

  /* ============================================
     UPDATE STATUS
  ============================================ */

  const updateStatus = async (
    inquiryId,
    status
  ) => {
    try {
      setError("");

      const token = localStorage.getItem(
        "nova_admin_token"
      );

      if (!token) {
        redirectToLogin();
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/inquiries/${inquiryId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result =
        await response.json();

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update status."
        );
      }

      setInquiries((prev) =>
        prev.map((item) =>
          item._id === inquiryId
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error(
        "Update inquiry status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update inquiry status."
      );
    }
  };

  /* ============================================
     DELETE
  ============================================ */

  const handleDelete = async (
    inquiry
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete the inquiry from "${inquiry.name}"?`
      );

    if (!confirmed) {
      setOpenMenu(null);
      return;
    }

    try {
      setDeletingId(inquiry._id);
      setError("");

      const token = localStorage.getItem(
        "nova_admin_token"
      );

      if (!token) {
        redirectToLogin();
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/inquiries/${inquiry._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result =
        await response.json();

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete inquiry."
        );
      }

      setInquiries((prev) =>
        prev.filter(
          (item) =>
            item._id !== inquiry._id
        )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error(
        "Delete inquiry error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete inquiry."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ============================================
     DATE
  ============================================ */

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "—";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ============================================
     OUTSIDE MENU CLICK
  ============================================ */

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        !event.target.closest(
          ".admin-inquiry-card__actions"
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
     LOADING
  ============================================ */

  if (loading) {
    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__logo admin-sidebar__desktop-logo">
            <h1>NOVA</h1>

            <span>
              FLOORING STUDIO
            </span>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-inquiries__loading">
            Loading inquiries...
          </div>
        </main>
      </div>
    );
  }

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div className="admin-layout">

      {/* MOBILE OVERLAY */}

      {menuOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={closeMenu}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`admin-sidebar ${
          menuOpen
            ? "admin-sidebar--mobile-open"
            : ""
        }`}
      >
        <div className="admin-sidebar__top">

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

          <div className="admin-sidebar__logo admin-sidebar__desktop-logo">
            <h1>NOVA</h1>

            <span>
              FLOORING STUDIO
            </span>
          </div>

          <nav className="admin-sidebar__nav">

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

            <Link
              to="/admin/inquiries"
              className="admin-sidebar__item active"
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

        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar__bottom">

          <div className="admin-sidebar__divider" />

          {/* LOGOUT */}

          <button
            type="button"
            className="admin-sidebar__item admin-sidebar__logout"
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

      {/* MAIN */}

      <main className="admin-main">

        {/* TOPBAR */}

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
                Manage customer inquiries
                and requests.
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

        {/* CONTENT */}

        <div className="admin-inquiries">

          {/* HEADING */}

          <section className="admin-inquiries__heading">

            <div>
              <p>
                CUSTOMER COMMUNICATION
              </p>

              <h1>
                Inquiries
              </h1>

              <span>
                MANAGE CUSTOMER REQUESTS
              </span>
            </div>

          </section>

          {/* ERROR */}

          {error && (
            <div className="admin-dashboard__error">
              {error}
            </div>
          )}

          {/* STATS */}

          <section className="admin-inquiries__stats">

            <div className="admin-inquiry-stat">
              <div className="admin-inquiry-stat__icon">
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
              </div>

              <div>
                <strong>
                  {stats.total}
                </strong>

                <span>
                  Total Inquiries
                </span>
              </div>
            </div>

            <div className="admin-inquiry-stat">
              <div className="admin-inquiry-stat__icon admin-inquiry-stat__icon--new">
                <span />
              </div>

              <div>
                <strong>
                  {stats.new}
                </strong>

                <span>
                  New
                </span>
              </div>
            </div>

            <div className="admin-inquiry-stat">
              <div className="admin-inquiry-stat__icon admin-inquiry-stat__icon--contacted">
                <svg viewBox="0 0 24 24">
                  <path d="M4 12h16" />
                  <path d="M12 4v16" />
                </svg>
              </div>

              <div>
                <strong>
                  {stats.contacted}
                </strong>

                <span>
                  Contacted
                </span>
              </div>
            </div>

            <div className="admin-inquiry-stat">
              <div className="admin-inquiry-stat__icon admin-inquiry-stat__icon--resolved">
                <svg viewBox="0 0 24 24">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>

              <div>
                <strong>
                  {stats.resolved}
                </strong>

                <span>
                  Resolved
                </span>
              </div>
            </div>

          </section>

          {/* TOOLBAR */}

          <section className="admin-inquiries__toolbar">

            <div className="admin-inquiries__search">

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
                placeholder="Search inquiries..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              className="admin-inquiries__filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Inquiries
              </option>

              <option value="new">
                New
              </option>

              <option value="contacted">
                Contacted
              </option>

              <option value="resolved">
                Resolved
              </option>
            </select>

          </section>

          {/* LIST */}

          {filteredInquiries.length ===
          0 ? (

            <div className="admin-inquiries__empty">

              <div className="admin-inquiries__empty-icon">
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
              </div>

              <h3>
                No inquiries found
              </h3>

              <p>
                {search ||
                statusFilter !==
                  "All"
                  ? "Try changing your search or filter."
                  : "Customer inquiries will appear here."}
              </p>

            </div>

          ) : (

            <section className="admin-inquiries__list">

              {filteredInquiries.map(
                (inquiry) => (

                  <article
                    key={inquiry._id}
                    className="admin-inquiry-card"
                  >

                    {/* TOP */}

                    <div className="admin-inquiry-card__top">

                      <div className="admin-inquiry-card__identity">

                        <div className="admin-inquiry-card__avatar">
                          {inquiry.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "C"}
                        </div>

                        <div>
                          <h3>
                            {inquiry.name}
                          </h3>

                          <span>
                            {inquiry.email}
                          </span>
                        </div>

                      </div>

                      <div className="admin-inquiry-card__actions">

                        <button
                          type="button"
                          className="admin-inquiry-card__menu"
                          disabled={
                            deletingId ===
                            inquiry._id
                          }
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              (prev) =>
                                prev ===
                                inquiry._id
                                  ? null
                                  : inquiry._id
                            );
                          }}
                        >
                          ⋮
                        </button>

                        {openMenu ===
                          inquiry._id && (

                          <div className="admin-inquiry-card__menu-dropdown">

                            {inquiry.status ===
                              "new" && (

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(
                                    inquiry._id,
                                    "contacted"
                                  )
                                }
                              >
                                Mark Contacted
                              </button>

                            )}

                            {inquiry.status !==
                              "resolved" && (

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(
                                    inquiry._id,
                                    "resolved"
                                  )
                                }
                              >
                                Mark Resolved
                              </button>

                            )}

                            <button
                              type="button"
                              className="admin-inquiry-card__delete"
                              onClick={() =>
                                handleDelete(
                                  inquiry
                                )
                              }
                            >
                              Delete Inquiry
                            </button>

                          </div>

                        )}

                      </div>

                    </div>

                    {/* INFO */}

                    <div className="admin-inquiry-card__info">

                      {inquiry.phone && (
                        <div>
                          <span>
                            Phone
                          </span>

                          <strong>
                            {inquiry.phone}
                          </strong>
                        </div>
                      )}

                      {inquiry.projectType && (
                        <div>
                          <span>
                            Project Type
                          </span>

                          <strong>
                            {inquiry.projectType}
                          </strong>
                        </div>
                      )}

                      {inquiry.location && (
                        <div>
                          <span>
                            Location
                          </span>

                          <strong>
                            {inquiry.location}
                          </strong>
                        </div>
                      )}

                      <div>
                        <span>
                          Received
                        </span>

                        <strong>
                          {formatDate(
                            inquiry.createdAt
                          )}
                        </strong>
                      </div>

                    </div>

                    {/* SUBJECT */}

                    {inquiry.subject && (
                      <div className="admin-inquiry-card__subject">

                        <span>
                          Subject
                        </span>

                        <h4>
                          {inquiry.subject}
                        </h4>

                      </div>
                    )}

                    {/* MESSAGE */}

                    <div className="admin-inquiry-card__message">

                      <span>
                        Message
                      </span>

                      <p>
                        {inquiry.message}
                      </p>

                    </div>

                    {/* FOOTER */}

                    <div className="admin-inquiry-card__footer">

                      <span
                        className={`admin-inquiry-status admin-inquiry-status--${inquiry.status}`}
                      >
                        <i />

                        {getStatusLabel(
                          inquiry.status
                        )}
                      </span>

                      <a
                        href={`mailto:${inquiry.email}`}
                        className="admin-inquiry-card__email"
                      >
                        Reply by Email →
                      </a>

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

export default AdminInquiries;