import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import adminLogout from "../utils/adminLogout";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const AdminCollectionProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ============================================
     STATE
  ============================================ */

  const [menuOpen, setMenuOpen] = useState(false);

  const [collection, setCollection] =
    useState(null);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
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

  /* ============================================
     FETCH COLLECTION
  ============================================ */

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem(
          "nova_admin_token"
        );

        if (!token) {
          navigate("/admin/login", {
            replace: true,
          });
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/collections/${id}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const contentType =
          response.headers.get("content-type") ||
          "";

        if (
          !contentType.includes("application/json")
        ) {
          throw new Error(
            "Collection API is not available."
          );
        }

        const result = await response.json();

        if (response.status === 401) {
          localStorage.removeItem(
            "nova_admin_token"
          );
          localStorage.removeItem(
            "nova_admin"
          );

          navigate("/admin/login", {
            replace: true,
          });

          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to load collection."
          );
        }

        setCollection(result.data);
      } catch (err) {
        console.error(
          "Collection fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load collection."
        );
      }
    };

    fetchCollection();
  }, [id, navigate]);

  /* ============================================
     FETCH PRODUCTS USING COLLECTION SLUG
  ============================================ */

  useEffect(() => {
    const fetchProducts = async () => {
      if (!collection?.slug) return;

      try {
        setError("");

        const token = localStorage.getItem(
          "nova_admin_token"
        );

        if (!token) {
          navigate("/admin/login", {
            replace: true,
          });
          return;
        }

        const response = await fetch(
          `${API_URL}/api/admin/products/collection/${encodeURIComponent(
            collection.slug
          )}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const contentType =
          response.headers.get("content-type") ||
          "";

        if (
          !contentType.includes("application/json")
        ) {
          throw new Error(
            "Products API is not available."
          );
        }

        const result = await response.json();

        if (response.status === 401) {
          localStorage.removeItem(
            "nova_admin_token"
          );
          localStorage.removeItem(
            "nova_admin"
          );

          navigate("/admin/login", {
            replace: true,
          });

          return;
        }

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to load products."
          );
        }

        setProducts(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "Products fetch error:",
          err
        );

        setProducts([]);

        setError(
          err.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collection, navigate]);

  /* ============================================
     SEARCH + FILTER
  ============================================ */

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const name =
        product.name?.toLowerCase() || "";

      const code =
        product.code?.toLowerCase() || "";

      const subtitle =
        product.subtitle?.toLowerCase() || "";

      const finish =
        product.finish?.toLowerCase() || "";

      const colour =
        product.colour?.toLowerCase() || "";

      const space =
        product.space?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        name.includes(query) ||
        code.includes(query) ||
        subtitle.includes(query) ||
        finish.includes(query) ||
        colour.includes(query) ||
        space.includes(query);

      const matchesActive =
        activeFilter === "All" ||
        (activeFilter === "Active" &&
          product.isActive === true) ||
        (activeFilter === "Inactive" &&
          product.isActive !== true);

      return (
        matchesSearch &&
        matchesActive
      );
    });
  }, [
    products,
    search,
    activeFilter,
  ]);

  /* ============================================
     DELETE PRODUCT
  ============================================ */

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      setOpenMenu(null);
      return;
    }

    try {
      setDeletingId(product._id);
      setError("");

      const token = localStorage.getItem(
        "nova_admin_token"
      );

      if (!token) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/products/${product._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const contentType =
        response.headers.get("content-type") ||
        "";

      if (
        !contentType.includes("application/json")
      ) {
        throw new Error(
          "Product delete API is not available."
        );
      }

      const result =
        await response.json();

      if (response.status === 401) {
        localStorage.removeItem(
          "nova_admin_token"
        );
        localStorage.removeItem(
          "nova_admin"
        );

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete product."
        );
      }

      setProducts((prev) =>
        prev.filter(
          (item) =>
            item._id !== product._id
        )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ============================================
     CLOSE PRODUCT MENU WHEN CLICKING OUTSIDE
  ============================================ */

  useEffect(() => {
    const handleOutsideClick = (
      event
    ) => {
      if (
        !event.target.closest(
          ".admin-product-card__actions"
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
     DATE
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
     LOADING
  ============================================ */

  if (loading) {
    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__top">
            <div className="admin-sidebar__logo admin-sidebar__desktop-logo">
              <h1>NOVA</h1>

              <span>
                FLOORING STUDIO
              </span>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-collection-products__loading-page">
            Loading collection...
          </div>
        </main>
      </div>
    );
  }

  /* ============================================
     COLLECTION NOT FOUND
  ============================================ */

  if (!collection) {
    return (
      <div className="admin-layout">
        <main className="admin-main">
          <div className="admin-collection-products__not-found">
            <p>
              COLLECTION
            </p>

            <h1>
              Collection not found
            </h1>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/collections"
                )
              }
            >
              Back to Collections
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ============================================
     MAIN
  ============================================ */

  return (
    <div className="admin-layout">

      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}

      {menuOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={closeMenu}
        />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`admin-sidebar ${
          menuOpen
            ? "admin-sidebar--mobile-open"
            : ""
        }`}
      >
        <div className="admin-sidebar__top">

          {/* MOBILE HEADER */}

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

          {/* DESKTOP LOGO */}

          <div className="admin-sidebar__logo admin-sidebar__desktop-logo">
            <h1>NOVA</h1>

            <span>
              FLOORING STUDIO
            </span>
          </div>

          {/* NAVIGATION */}

          <nav className="admin-sidebar__nav">

            {/* DASHBOARD */}

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

            {/* PROJECTS */}

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

            {/* COLLECTIONS */}

            <Link
              to="/admin/collections"
              className="admin-sidebar__item active"
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

            {/* INQUIRIES */}

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

        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar__bottom">

          <div className="admin-sidebar__divider" />



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

      {/* ========================================
          MAIN
      ======================================== */}

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
                Manage products in your
                collection.
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

        {/* ========================================
            CONTENT
        ======================================== */}

        <div className="admin-collection-products">

          {/* BREADCRUMB */}

          <div className="admin-collection-products__breadcrumb">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/collections"
                )
              }
            >
              Collections
            </button>

            <span>›</span>

            <strong>
              {collection.name}
            </strong>

          </div>

          {/* HEADER */}

          <section className="admin-collection-products__heading">

            <div>

              <p className="admin-collection-products__eyebrow">
                COLLECTION
              </p>

              <h1>
                {collection.name}
              </h1>

              <div className="admin-collection-products__meta">

                <span>
                  {products.length}{" "}
                  {products.length === 1
                    ? "Product"
                    : "Products"}
                </span>

                {collection.tagline && (
                  <>
                    <span>•</span>

                    <span>
                      {collection.tagline}
                    </span>
                  </>
                )}

              </div>

              {collection.description && (
                <p className="admin-collection-products__description">
                  {collection.description}
                </p>
              )}

            </div>

            {/* ADD PRODUCT */}

            <button
              type="button"
              className="admin-collection-products__add-btn"
              onClick={() =>
                navigate(
                  `/admin/collections/${collection._id}/products/add`
                )
              }
            >
              <span>+</span>
              Add Product
            </button>

          </section>

          {/* ERROR */}

          {error && (
            <div className="admin-dashboard__error">
              {error}
            </div>
          )}

          {/* TOOLBAR */}

          <section className="admin-collection-products__toolbar">

            <div className="admin-collection-products__search">

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
                placeholder="Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              className="admin-collection-products__filter"
              value={activeFilter}
              onChange={(e) =>
                setActiveFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All Products
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </section>

          {/* ========================================
              PRODUCTS
          ======================================== */}

          {filteredProducts.length === 0 ? (

            <div className="admin-collection-products__empty">

              <div className="admin-collection-products__empty-icon">
                +
              </div>

              <h3>
                No products found
              </h3>

              <p>
                {search ||
                activeFilter !== "All"
                  ? "Try changing your search or filter."
                  : "Add the first product to this collection."}
              </p>

              {!search &&
                activeFilter ===
                  "All" && (

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/collections/${collection._id}/products/add`
                      )
                    }
                  >
                    + Add Product
                  </button>

                )}

            </div>

          ) : (

            <section className="admin-collection-products__grid">

              {filteredProducts.map(
                (product) => (

                  <article
                    key={product._id}
                    className="admin-product-card"
                  >

                    {/* IMAGE */}

                    <div className="admin-product-card__image">

                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={
                            product.name ||
                            "Product"
                          }
                        />
                      ) : (

                        <div className="admin-product-card__no-image">
                          <span>
                            NOVA
                          </span>
                        </div>

                      )}

                      {/* STATUS */}

                      <span
                        className={`admin-product-card__status ${
                          product.isActive
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                      {/* THREE DOT MENU */}

                      <div className="admin-product-card__actions">

                        <button
                          type="button"
                          className="admin-product-card__menu"
                          aria-label={`Options for ${
                            product.name ||
                            "product"
                          }`}
                          disabled={
                            deletingId ===
                            product._id
                          }
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              (prev) =>
                                prev ===
                                product._id
                                  ? null
                                  : product._id
                            );
                          }}
                        >
                          ⋮
                        </button>

                        {/* ONLY DELETE */}

                        {openMenu ===
                          product._id && (

                          <div className="admin-product-card__menu-dropdown">

                            <button
                              type="button"
                              className="admin-product-card__delete-action"
                              disabled={
                                deletingId ===
                                product._id
                              }
                              onClick={(e) => {
                                e.stopPropagation();

                                handleDeleteProduct(
                                  product
                                );
                              }}
                            >
                              {deletingId ===
                              product._id
                                ? "Deleting..."
                                : "Delete Product"}
                            </button>

                          </div>

                        )}

                      </div>

                    </div>

                    {/* PRODUCT BODY */}

                    <div className="admin-product-card__body">

                      <div className="admin-product-card__code">
                        {product.code}
                      </div>

                      <h3>
                        {product.name ||
                          "Untitled Product"}
                      </h3>

                      {product.subtitle && (
                        <p className="admin-product-card__subtitle">
                          {product.subtitle}
                        </p>
                      )}

                      <div className="admin-product-card__details">

                        {product.colour && (
                          <span>
                            {product.colour}
                          </span>
                        )}

                        {product.finish && (
                          <span>
                            {product.finish}
                          </span>
                        )}

                        {product.space && (
                          <span>
                            {product.space}
                          </span>
                        )}

                      </div>

                      <div className="admin-product-card__footer">

                        <span>
                          {formatDate(
                            product.createdAt
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

export default AdminCollectionProducts;