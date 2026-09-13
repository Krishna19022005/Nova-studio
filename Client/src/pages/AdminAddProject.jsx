import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminAddProject = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    location: "",
    surface: "",
    projectType: "",
    studio: "NOVA Flooring Studio",
    story: [""],
    imageUrl: "",
    gallery: [""],
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [uploadingMainImage, setUploadingMainImage] =
    useState(false);

  const [uploadingGalleryImage, setUploadingGalleryImage] =
    useState(false);

  /* ============================================
     BASIC FIELD CHANGE
     ============================================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================
     AUTO SLUG
     ============================================ */

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  /* ============================================
     STORY
     ============================================ */

  const handleStoryChange = (index, value) => {
    setForm((prev) => {
      const updatedStory = [...prev.story];
      updatedStory[index] = value;

      return {
        ...prev,
        story: updatedStory,
      };
    });
  };

  const addStoryItem = () => {
    setForm((prev) => ({
      ...prev,
      story: [...prev.story, ""],
    }));
  };

  const removeStoryItem = (index) => {
    setForm((prev) => {
      const updatedStory = prev.story.filter(
        (_, i) => i !== index
      );

      return {
        ...prev,
        story: updatedStory.length
          ? updatedStory
          : [""],
      };
    });
  };

  /* ============================================
     IMAGE UPLOAD
     ============================================ */

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
      throw new Error(
        "Please select a valid image file."
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new Error(
        "Image size must be 10 MB or less."
      );
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

    if (!file) {
      return;
    }

    try {
      setUploadingMainImage(true);
      setError("");

      const url = await uploadImage(
        file,
        "/api/uploads/project-image"
      );

      if (!url) {
        return;
      }

      setForm((prev) => ({
        ...prev,
        imageUrl: url,
      }));
    } catch (err) {
      console.error(
        "Project main image upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload project image."
      );
    } finally {
      setUploadingMainImage(false);
      event.target.value = "";
    }
  };

  const handleGalleryImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingGalleryImage(true);
      setError("");

      const url = await uploadImage(
        file,
        "/api/uploads/project-gallery-image"
      );

      if (!url) {
        return;
      }

      setForm((prev) => ({
        ...prev,
        gallery: [
          ...prev.gallery.filter(Boolean),
          url,
        ],
      }));
    } catch (err) {
      console.error(
        "Project gallery image upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload project gallery image."
      );
    } finally {
      setUploadingGalleryImage(false);
      event.target.value = "";
    }
  };

  const removeGalleryItem = (index) => {
    setForm((prev) => {
      const currentGallery =
        prev.gallery.filter(Boolean);

      return {
        ...prev,
        gallery: currentGallery.filter(
          (_, i) => i !== index
        ),
      };
    });
  };

  /* ============================================
     SUBMIT
     ============================================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.name.trim()) {
        throw new Error("Project name is required.");
      }

      if (!form.slug.trim()) {
        throw new Error("Project slug is required.");
      }

      if (!form.category.trim()) {
        throw new Error("Category is required.");
      }

      const cleanStory = form.story
        .map((item) => item.trim())
        .filter(Boolean);

      const cleanGallery = form.gallery
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        category: form.category.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        surface: form.surface.trim(),
        projectType: form.projectType.trim(),
        studio: form.studio.trim() || "NOVA Flooring Studio",
        story: cleanStory,
        imageUrl: form.imageUrl.trim(),
        gallery: cleanGallery,
        isActive: form.isActive,
      };

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
        `${API_URL}/api/admin/projects`,
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

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create project."
        );
      }

      navigate("/admin/projects");
    } catch (err) {
      console.error("Add project error:", err);

      setError(
        err.message || "Unable to create project."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-add-project">
      <div className="admin-add-project__container">

        {/* ============================================
            HEADER
            ============================================ */}

        <div className="admin-add-project__header">
          <div>
            <p className="admin-add-project__eyebrow">
              PROJECTS / ADD PROJECT
            </p>

            <h1>Add New Project</h1>

            <p className="admin-add-project__subtitle">
              Add project details, story and images to
              showcase your work.
            </p>
          </div>

          <button
            type="button"
            className="admin-add-project__close"
            onClick={() => navigate("/admin/projects")}
            disabled={saving}
          >
            ×
          </button>
        </div>

        {/* ============================================
            ERROR
            ============================================ */}

        {error && (
          <div className="admin-add-project__error">
            {error}
          </div>
        )}

        {/* ============================================
            FORM
            ============================================ */}

        <form
          className="admin-add-project__form"
          onSubmit={handleSubmit}
        >

          {/* ========================================
              LEFT COLUMN
              ======================================== */}

          <div className="admin-add-project__column">

            {/* Project Name */}

            <div className="admin-form-field">
              <label>
                Project Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                placeholder="Enter project name"
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
                placeholder="project-slug"
                disabled={saving}
              />

              <small className="admin-form-help">
                Used in the project URL.
              </small>
            </div>

            {/* Category */}

            <div className="admin-form-field">
              <label>
                Category <span>*</span>
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">
                  Select category
                </option>

                <option value="Residential">
                  Residential
                </option>

                <option value="Commercial">
                  Commercial
                </option>

                <option value="Industrial">
                  Industrial
                </option>

                <option value="Hospitality">
                  Hospitality
                </option>
              </select>
            </div>

            {/* Location */}

            <div className="admin-form-field">
              <label>Location</label>

              <div className="admin-form-input-with-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.2"
                  />
                </svg>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter project location"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Surface */}

            <div className="admin-form-field">
              <label>Surface</label>

              <input
                type="text"
                name="surface"
                value={form.surface}
                onChange={handleChange}
                placeholder="e.g. 2500 sq. ft."
                disabled={saving}
              />
            </div>

            {/* Project Type */}

            <div className="admin-form-field">
              <label>Project Type</label>

              <input
                type="text"
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                placeholder="e.g. Residential Flooring"
                disabled={saving}
              />
            </div>

            {/* Studio */}

            <div className="admin-form-field">
              <label>Studio</label>

              <input
                type="text"
                name="studio"
                value={form.studio}
                onChange={handleChange}
                placeholder="NOVA Flooring Studio"
                disabled={saving}
              />
            </div>

            {/* Active */}

            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                disabled={saving}
              />

              <span>
                Make this project active
              </span>
            </label>
          </div>

          {/* ========================================
              RIGHT COLUMN
              ======================================== */}

          <div className="admin-add-project__column">

            {/* Description */}

            <div className="admin-form-field">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write project description..."
                rows={7}
                disabled={saving}
              />
            </div>

            {/* Story */}

            <div className="admin-form-field">
              <label>Project Story</label>

              <div className="admin-array-field">

                {form.story.map((item, index) => (
                  <div
                    className="admin-array-field__row"
                    key={index}
                  >
                    <textarea
                      value={item}
                      onChange={(e) =>
                        handleStoryChange(
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Story point ${index + 1}`}
                      rows={3}
                      disabled={saving}
                    />

                    <button
                      type="button"
                      className="admin-array-field__remove"
                      onClick={() =>
                        removeStoryItem(index)
                      }
                      disabled={saving}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="admin-array-field__add"
                  onClick={addStoryItem}
                  disabled={saving}
                >
                  + Add Story Point
                </button>
              </div>
            </div>

            {/* Main Image */}

            <div className="admin-form-field">
              <label>Main Project Image</label>

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

              {uploadingMainImage && (
                <div className="admin-form-uploading">
                  Uploading main project image...
                </div>
              )}

              {form.imageUrl && (
                <div className="admin-add-project__image-preview">
                  <img
                    src={form.imageUrl}
                    alt="Project preview"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gallery */}

            <div className="admin-form-field">
              <label>Gallery Images</label>

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

              {uploadingGalleryImage && (
                <div className="admin-form-uploading">
                  Uploading gallery image...
                </div>
              )}

              {form.gallery.filter(Boolean).length > 0 && (
                <div className="admin-array-field">
                  {form.gallery
                    .filter(Boolean)
                    .map((item, index) => (
                      <div
                        className="admin-array-field__row"
                        key={`${item}-${index}`}
                      >
                        <div className="admin-add-project__gallery-item">
                          <img
                            src={item}
                            alt={`Gallery ${
                              index + 1
                            }`}
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          className="admin-array-field__remove"
                          onClick={() =>
                            removeGalleryItem(index)
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
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================
              ACTIONS
              ======================================== */}

          <div className="admin-add-project__actions">

            <button
              type="button"
              className="admin-add-project__cancel"
              onClick={() =>
                navigate("/admin/projects")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-add-project__save"
              disabled={
                saving ||
                uploadingMainImage ||
                uploadingGalleryImage
              }
            >
              {saving ? "Saving..." : "Save Project"}

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

export default AdminAddProject;