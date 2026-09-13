import express from "express";

import {
  getAdminCollections,
  getAdminCollection,
  createAdminCollection,
  deleteAdminCollection,
} from "../controllers/adminCollectionController.js";

const router = express.Router();

router.get("/", getAdminCollections);

router.get("/:id", getAdminCollection);

router.post("/", createAdminCollection);

router.delete("/:id", deleteAdminCollection);

export default router;