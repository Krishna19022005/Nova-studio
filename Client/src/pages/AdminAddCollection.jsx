import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminLogout from "../utils/adminLogout";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminAddCollection = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    imageUrl: "",
    number: "",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");

  /* ============================================
     SLUG GENERATOR
     ============================================ */

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  /* ============================================
     NAME CHANGE
     ============================================ */

  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  /* ============================================
     OTHER FIELDS
     ============================================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================
     COLLECTION IMAGE UPLOAD
     ============================================ */

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must be 10 MB or less.");
      e.target.value = "";
      return;
    }

    try {
      setImageUploading(true);
      setError("");

      const token = localStorage.getItem("nova_admin_token");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/api/uploads/collection-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
          result.message || "Failed to upload collection image."
        );
      }

      setForm((prev) => ({
        ...prev,
        imageUrl: result.data?.url || "",
      }));
    } catch (err) {
      console.error("Collection image upload error:", err);
      setError(
        err.message || "Unable to upload collection image."
      );
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  /* ============================================
     SUBMIT
     ============================================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (!form.name.trim()) {
        throw new Error(
          "Collection name is required."
        );
      }

      if (!form.slug.trim()) {
        throw new Error(
          "Collection slug is required."
        );
      }

      if (!form.tagline.trim()) {
        throw new Error(
          "Collection tagline is required."
        );
      }

      if (!form.description.trim()) {
        throw new Error(
          "Collection description is required."
        );
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        number: form.number.trim(),
        isActive: form.isActive,
      };

      const response = await fetch(
        `${API_URL}/api/admin/collections`,
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
            "Failed to create collection."
        );
      }

      navigate("/admin/collections");
    } catch (err) {
      console.error(
        "Add collection error:",
        err
      );

      setError(
        err.message ||
          "Unable to create collection."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-add-collection">
      <div className="admin-add-collection__container">

        {/* =========================================
            HEADER
            ========================================= */}

        <div className="admin-add-collection__header">
          <div>
            <p className="admin-add-collection__eyebrow">
              COLLECTIONS / ADD COLLECTION
            </p>

            <h1>
              Add New Collection
            </h1>

            <p className="admin-add-collection__subtitle">
              Create a new collection to
              showcase your flooring range.
            </p>
          </div>

          <button
            type="button"
            className="admin-add-collection__close"
            onClick={() =>
              navigate("/admin/collections")
            }
            disabled={saving}
          >
            ×
          </button>
        </div>

        {/* =========================================
            ERROR
            ========================================= */}

        {error && (
          <div className="admin-add-collection__error">
            {error}
          </div>
        )}

        {/* =========================================
            FORM
            ========================================= */}

        <form
          className="admin-add-collection__form"
          onSubmit={handleSubmit}
        >
          {/* =======================================
              LEFT COLUMN
              ======================================= */}

          <div className="admin-add-collection__column">

            {/* Collection Name */}

            <div className="admin-form-field">
              <label>
                Collection Name{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                placeholder="Enter collection name"
                disabled={saving}
              />
            </div>

            {/* Slug */}

            <div className="admin-form-field">
              <label>
                Slug <span>*</span>
              </label>

              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="collection-slug"
                disabled={saving}
              />

              <small className="admin-form-help">
                Used in the collection URL.
              </small>
            </div>

            {/* Tagline */}

            <div className="admin-form-field">
              <label>
                Tagline <span>*</span>
              </label>

              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="e.g. Durable. Stylish. Timeless."
                disabled={saving}
              />
            </div>

            {/* Number */}

            <div className="admin-form-field">
              <label>
                Collection Number
              </label>

              <input
                type="text"
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="e.g. 01"
                disabled={saving}
              />

              <small className="admin-form-help">
                Optional display number for the collection.
              </small>
            </div>

            {/* Active */}

            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive:
                      e.target.checked,
                  }))
                }
                disabled={saving}
              />

              <span>
                Make this collection active
              </span>
            </label>
          </div>

          {/* =======================================
              RIGHT COLUMN
              ======================================= */}

          <div className="admin-add-collection__column">

            {/* Description */}

            <div className="admin-form-field">
              <label>
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a detailed collection description..."
                rows={9}
                disabled={saving}
              />

              <div className="admin-form-counter">
                {form.description.length}{" "}
                characters
              </div>
            </div>

            {/* Collection Image */}

            <div className="admin-form-field">
              <label>
                Collection Image
              </label>

              <div className="admin-image-input">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={saving || imageUploading}
                />

                <p>
                  {imageUploading
                    ? "Uploading image..."
                    : "Upload an image to Cloudinary."}
                </p>
              </div>

              {/* Image Preview */}

              {form.imageUrl && (
                <div className="admin-add-collection__image-preview">
                  <img
                    src={form.imageUrl}
                    alt={form.name || "Collection preview"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* =======================================
              ACTIONS
              ======================================= */}

          <div className="admin-add-collection__actions">
            <button
              type="button"
              className="admin-add-collection__cancel"
              onClick={() =>
                navigate("/admin/collections")
              }
              disabled={saving || imageUploading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-add-collection__save"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Collection"}

              {!saving && (
                <span>→</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AdminAddCollection;