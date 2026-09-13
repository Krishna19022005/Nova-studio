import express from "express";

import {
  getAdminProjects,
  createAdminProject,
  deleteAdminProject,
} from "../controllers/adminProjectController.js";

const router = express.Router();

router.get(
  "/",
  getAdminProjects
);

router.post(
  "/",
  createAdminProject
);

router.delete(
  "/:id",
  deleteAdminProject
);

export default router;