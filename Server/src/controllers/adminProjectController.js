import Project from "../models/Project.js";

export const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error(
      "Get admin projects error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load projects",
    });
  }
};

export const createAdminProject = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      description,
      location,
      surface,
      projectType,
      studio,
      story,
      imageUrl,
      gallery,
      isActive,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required.",
      });
    }

    if (!slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project slug is required.",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    const project = await Project.create({
      name: name.trim(),

      slug: slug.trim().toLowerCase(),

      category: category.trim(),

      description:
        description?.trim() || "",

      location:
        location?.trim() || "",

      surface:
        surface?.trim() || "",

      projectType:
        projectType?.trim() || "",

      studio:
        studio?.trim() ||
        "NOVA Flooring Studio",

      story: Array.isArray(story)
        ? story
        : [],

      imageUrl:
        imageUrl?.trim() || "",

      gallery: Array.isArray(gallery)
        ? gallery
        : [],

      isActive:
        isActive !== false,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    console.error(
      "Create admin project error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A project with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
};

export const deleteAdminProject = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const project =
      await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete admin project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
};