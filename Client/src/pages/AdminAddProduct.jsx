import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import adminLogout from "../utils/adminLogout";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const createSlug = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [collection, setCollection] = useState(null);

  const [loadingCollection, setLoadingCollection] =
    useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    code: "",
    subtitle: "",
    finish: "",
    colour: "",
    space: "",
    description: "",
    imageUrl: "",
    gallery: [],
    isActive: true,
  });

  const [specs, setSpecs] = useState([
    { key: "Coverage", value: "" },
    { key: "Thickness", value: "" },
    { key: "Finish Type", value: "" },
    { key: "Application Areas", value: "" },
  ]);

  const [galleryInput, setGalleryInput] = useState("");

  const [uploadingMainImage, setUploadingMainImage] =
    useState(false);

  const [uploadingGalleryImage, setUploadingGalleryImage] =
    useState(false);

  /* =========================================
     AUTH HEADERS
  ========================================= */

  const getAuthHeaders = () => {
    const token = localStorage.getItem(
      "nova_admin_token"
    );

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  /* =========================================
     FETCH COLLECTION
  ========================================= */

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoadingCollection(true);
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
              "Failed to load collection."
          );
        }

        setCollection(result.data);
      } catch (err) {
        console.error(
          "Admin add product collection error:",
          err
        );

        setError(
          err.message ||
            "Unable to load collection."
        );
      } finally {
        setLoadingCollection(false);
      }
    };

    fetchCollection();
  }, [id, navigate]);

  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================================
     PRODUCT NAME -> SLUG
  ========================================= */

  const handleNameChange = (event) => {
    const name = event.target.value;

    setForm((prev) => ({
      ...prev,
      name,
      slug: createSlug(name),
    }));
  };

  /* =========================================
     SPECS
  ========================================= */

  const updateSpec = (index, field, value) => {
    setSpecs((prev) =>
      prev.map((spec, i) =>
        i === index
          ? {
              ...spec,
              [field]: value,
            }
          : spec
      )
    );
  };

  const addSpec = () => {
    setSpecs((prev) => [
      ...prev,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const removeSpec = (index) => {
    setSpecs((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* =========================================
     IMAGE UPLOAD
  ========================================= */

  const uploadImage = async (file, endpoint) => {
    const token = localStorage.getItem(
      "nova_admin_token"
    );

    if (!token) {
      navigate("/admin/login", {
        replace: true,
      });
      return null;
    }

    if (!file) {
      return null;
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image size must be 10 MB or less.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    let result = {};

    try {
      result = await response.json();
    } catch {
      throw new Error(
        "Image upload failed. Server returned an invalid response."
      );
    }

    if (response.status === 401) {
      localStorage.removeItem("nova_admin_token");
      localStorage.removeItem("nova_admin");
      navigate("/admin/login", {
        replace: true,
      });
      return null;
    }

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Image upload failed."
      );
    }

    return result.data?.url || "";
  };

  const handleMainImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingMainImage(true);
      setError("");

      const url = await uploadImage(
        file,
        "/api/uploads/product-image"
      );

      if (!url) return;

      setForm((prev) => ({
        ...prev,
        imageUrl: url,
      }));
    } catch (err) {
      console.error(
        "Product main image upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload product image."
      );
    } finally {
      setUploadingMainImage(false);
      event.target.value = "";
    }
  };

  const handleGalleryImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingGalleryImage(true);
      setError("");

      const url = await uploadImage(
        file,
        "/api/uploads/product-gallery-image"
      );

      if (!url) return;

      setForm((prev) => ({
        ...prev,
        gallery: [...prev.gallery, url],
      }));
    } catch (err) {
      console.error(
        "Product gallery image upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload gallery image."
      );
    } finally {
      setUploadingGalleryImage(false);
      event.target.value = "";
    }
  };

  /* =========================================
     GALLERY
  ========================================= */

  const addGalleryImage = () => {
    const url = galleryInput.trim();

    if (!url) return;

    setForm((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        url,
      ],
    }));

    setGalleryInput("");
  };

  const removeGalleryImage = (index) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* =========================================
     SAVE PRODUCT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!collection) {
      setError(
        "Collection information is unavailable."
      );
      return;
    }

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.code.trim()) {
      setError("Product code is required.");
      return;
    }

    try {
      setSaving(true);
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

      const specsObject = {};

      specs.forEach((spec) => {
        const key = spec.key.trim();
        const value = spec.value.trim();

        if (key && value) {
          specsObject[key] = value;
        }
      });

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        code: form.code.trim(),

        // Product.collection stores the collection slug
        collection: collection.slug,

        subtitle: form.subtitle.trim(),
        finish: form.finish.trim(),
        colour: form.colour.trim(),
        space: form.space.trim(),
        description: form.description.trim(),

        specs: specsObject,

        imageUrl: form.imageUrl.trim(),

        gallery: form.gallery,

        isActive: form.isActive,
      };

      const response = await fetch(
        `${API_URL}/api/admin/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

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
            "Failed to create product."
        );
      }

      navigate(
        `/admin/collections/${id}`
      );
    } catch (err) {
      console.error(
        "Create product error:",
        err
      );

      setError(
        err.message ||
          "Unable to create product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loadingCollection) {
    return (
      <div className="admin-layout">
        <main className="admin-main">
          <div className="admin-add-product-loading">
            Loading collection...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__top">
          <div className="admin-sidebar__logo">
            <h1>NOVA</h1>
            <span>
              FLOORING STUDIO
            </span>
          </div>

          <nav className="admin-sidebar__nav">
            <Link
              to="/admin/dashboard"
              className="admin-sidebar__item"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/projects"
              className="admin-sidebar__item"
            >
              Projects
            </Link>

            <Link
              to="/admin/collections"
              className="admin-sidebar__item active"
            >
              Collections
            </Link>

            <Link
              to="/admin/inquiries"
              className="admin-sidebar__item"
            >
              Inquiries
            </Link>
          </nav>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <div className="admin-topbar__separator" />

            <div>
              <h3>
                Welcome back, Admin
              </h3>

              <p>
                Add a new product to your
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

        <div className="admin-add-product">

          {/* BREADCRUMB */}

          <div className="admin-add-product__breadcrumb">
            <Link to="/admin/collections">
              Collections
            </Link>

            <span>›</span>

            <Link
              to={`/admin/collections/${id}`}
            >
              {collection?.name ||
                "Collection"}
            </Link>

            <span>›</span>

            <strong>
              Add Product
            </strong>
          </div>

          {/* HEADER */}

          <section className="admin-add-product__heading">
            <div>
              <span>
                PRODUCT
              </span>

              <h1>
                Add New Product
              </h1>

              <p>
                Add product details, images and
                specifications.
              </p>
            </div>
          </section>

          {error && (
            <div className="admin-add-product__error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="admin-add-product__form"
          >
            <div className="admin-add-product__grid">

              {/* LEFT */}

              <div className="admin-add-product__left">

                <div className="admin-form-card">
                  <h2>
                    Basic Details
                  </h2>

                  <div className="admin-form-field">
                    <label>
                      Product Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>
                      Slug
                    </label>

                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="product-slug"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>
                      SKU / Code *
                    </label>

                    <input
                      type="text"
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      placeholder="Enter product code e.g. EP-001"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>
                      Short Description
                    </label>

                    <textarea
                      name="subtitle"
                      value={form.subtitle}
                      onChange={handleChange}
                      maxLength={150}
                      placeholder="Enter a short description"
                    />

                    <small>
                      {form.subtitle.length}/150
                    </small>
                  </div>

                  <div className="admin-form-field">
                    <label>
                      Detailed Description
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Write detailed description..."
                    />
                  </div>
                </div>

                {/* SPECIFICATIONS */}

                <div className="admin-form-card">
                  <div className="admin-form-card__header">
                    <div>
                      <h2>
                        Specifications
                      </h2>

                      <p>
                        Add custom product specifications.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="admin-form-add-small"
                      onClick={addSpec}
                    >
                      + Add
                    </button>
                  </div>

                  <div className="admin-spec-list">
                    {specs.map(
                      (spec, index) => (
                        <div
                          className="admin-spec-row"
                          key={index}
                        >
                          <input
                            value={spec.key}
                            onChange={(e) =>
                              updateSpec(
                                index,
                                "key",
                                e.target.value
                              )
                            }
                            placeholder="Specification"
                          />

                          <input
                            value={spec.value}
                            onChange={(e) =>
                              updateSpec(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            placeholder="Enter value"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeSpec(index)
                            }
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div className="admin-add-product__right">

                <div className="admin-form-card">
                  <h2>
                    Collection Details
                  </h2>

                  <div className="admin-form-field">
                    <label>
                      Collection
                    </label>

                    <input
                      type="text"
                      value={
                        collection?.name ||
                        ""
                      }
                      disabled
                    />

                    <small>
                      Product will be saved inside this
                      collection.
                    </small>
                  </div>

                  <div className="admin-form-field">
                    <label>
                      Colour
                    </label>

                    <input
                      type="text"
                      name="colour"
                      value={form.colour}
                      onChange={handleChange}
                      placeholder="e.g. White, Grey, Blue"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>
                      Finish
                    </label>

                    <input
                      type="text"
                      name="finish"
                      value={form.finish}
                      onChange={handleChange}
                      placeholder="e.g. Gloss, Matte"
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>
                      Application / Space
                    </label>

                    <input
                      type="text"
                      name="space"
                      value={form.space}
                      onChange={handleChange}
                      placeholder="e.g. Living Room, Commercial"
                    />
                  </div>
                </div>

                {/* MAIN IMAGE */}

                <div className="admin-form-card">
                  <h2>
                    Product Image
                  </h2>

                  <div className="admin-form-field">
                    <label>
                      Upload Product Image
                    </label>

                    <div className="admin-image-input">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        disabled={
                          saving ||
                          uploadingMainImage ||
                          uploadingGalleryImage
                        }
                      />

                      <p>
                        JPG, PNG, WEBP or other image files.
                        Maximum 10 MB.
                      </p>
                    </div>
                  </div>

                  {uploadingMainImage && (
                    <div className="admin-form-uploading">
                      Uploading product image...
                    </div>
                  )}

                  {form.imageUrl && (
                    <div className="admin-product-image-preview">
                      <img
                        src={form.imageUrl}
                        alt="Product preview"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* GALLERY */}

                <div className="admin-form-card">
                  <h2>
                    Image Gallery
                  </h2>

                  <div className="admin-form-field">
                    <label>
                      Upload Gallery Image
                    </label>

                    <div className="admin-image-input">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryImageUpload}
                        disabled={
                          saving ||
                          uploadingMainImage ||
                          uploadingGalleryImage
                        }
                      />

                      <p>
                        Upload gallery images one at a time.
                        Maximum 10 MB each.
                      </p>
                    </div>
                  </div>

                  {uploadingGalleryImage && (
                    <div className="admin-form-uploading">
                      Uploading gallery image...
                    </div>
                  )}

                  {form.gallery.length > 0 && (
                    <div className="admin-gallery-preview">
                      {form.gallery.map(
                        (image, index) => (
                          <div
                            key={`${image}-${index}`}
                          >
                            <img
                              src={image}
                              alt={`Gallery ${
                                index + 1
                              }`}
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeGalleryImage(
                                  index
                                )
                              }
                              disabled={
                                saving ||
                                uploadingMainImage ||
                                uploadingGalleryImage
                              }
                              aria-label={`Remove gallery image ${
                                index + 1
                              }`}
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* STATUS */}

                <div className="admin-form-card">
                  <div className="admin-product-status">

                    <div>
                      <h2>
                        Status
                      </h2>

                      <p>
                        Control whether this product
                        appears publicly.
                      </p>
                    </div>

                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={
                          form.isActive
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <span />
                    </label>

                    <strong>
                      {form.isActive
                        ? "Active"
                        : "Inactive"}
                    </strong>

                  </div>
                </div>

              </div>
            </div>

            {/* ACTIONS */}

            <div className="admin-add-product__actions">

              <button
                type="button"
                className="admin-add-product__cancel"
                onClick={() =>
                  navigate(
                    `/admin/collections/${id}`
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-add-product__save"
                disabled={
                  saving ||
                  uploadingMainImage ||
                  uploadingGalleryImage
                }
              >
                {saving
                  ? "Saving..."
                  : "Save Product"}
              </button>

            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminAddProduct;