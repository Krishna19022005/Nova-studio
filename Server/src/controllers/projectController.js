import Project from "../models/Project.js";

// ============================================
// GET ALL PROJECTS
// ============================================

export async function getProjects(req, res) {
  try {
    const projects = await Project.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects.",
    });
  }
}

// ============================================
// GET PROJECT BY SLUG
// ============================================

export async function getProjectBySlug(req, res) {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project by slug error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project.",
    });
  }
}

// ============================================
// CREATE PROJECT
// ============================================

export async function createProject(req, res) {
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

    if (!name || !slug || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, slug and category are required.",
      });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingProject = await Project.findOne({
      slug: normalizedSlug,
    });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "A project with this slug already exists.",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      slug: normalizedSlug,
      category: category.trim(),
      description: description?.trim() || "",
      location: location?.trim() || "",
      surface: surface?.trim() || "",
      projectType: projectType?.trim() || "",
      studio: studio?.trim() || "NOVA Flooring Studio",
      story: Array.isArray(story) ? story : [],
      imageUrl: imageUrl?.trim() || "",
      gallery: Array.isArray(gallery) ? gallery : [],
      isActive:
        typeof isActive === "boolean"
          ? isActive
          : true,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
}

// ============================================
// UPDATE PROJECT
// ============================================

export async function updateProject(req, res) {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({
      slug: slug.toLowerCase(),
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const {
      name,
      newSlug,
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

    if (name !== undefined) {
      project.name = name.trim();
    }

    if (category !== undefined) {
      project.category = category.trim();
    }

    if (description !== undefined) {
      project.description = description.trim();
    }

    if (location !== undefined) {
      project.location = location.trim();
    }

    if (surface !== undefined) {
      project.surface = surface.trim();
    }

    if (projectType !== undefined) {
      project.projectType = projectType.trim();
    }

    if (studio !== undefined) {
      project.studio = studio.trim();
    }

    if (story !== undefined) {
      project.story = Array.isArray(story) ? story : [];
    }

    if (imageUrl !== undefined) {
      project.imageUrl = imageUrl.trim();
    }

    if (gallery !== undefined) {
      project.gallery = Array.isArray(gallery) ? gallery : [];
    }

    if (isActive !== undefined) {
      project.isActive = Boolean(isActive);
    }

    if (newSlug !== undefined) {
      const normalizedNewSlug =
        newSlug.trim().toLowerCase();

      if (normalizedNewSlug !== project.slug) {
        const slugExists = await Project.findOne({
          slug: normalizedNewSlug,
          _id: { $ne: project._id },
        });

        if (slugExists) {
          return res.status(409).json({
            success: false,
            message:
              "A project with this slug already exists.",
          });
        }

        project.slug = normalizedNewSlug;
      }
    }

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project.",
    });
  }
}

// ============================================
// DELETE PROJECT
// ============================================

export async function deleteProject(req, res) {
  try {
    const { slug } = req.params;

    const project = await Project.findOneAndDelete({
      slug: slug.toLowerCase(),
    });

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
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
}