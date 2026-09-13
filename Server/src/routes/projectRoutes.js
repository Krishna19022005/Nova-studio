import express from "express";

import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getProjects);

router.get("/:slug", getProjectBySlug);

router.post("/", createProject);

router.put("/:slug", updateProject);

router.delete("/:slug", deleteProject);

export default router;