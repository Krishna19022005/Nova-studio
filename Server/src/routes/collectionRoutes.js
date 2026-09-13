import express from "express";

import {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";

const router = express.Router();

router.get(
  "/",
  getCollections
);

router.get(
  "/:slug",
  getCollectionBySlug
);

router.post(
  "/",
  createCollection
);

router.put(
  "/:slug",
  updateCollection
);

router.delete(
  "/:slug",
  deleteCollection
);

export default router;