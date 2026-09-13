import express from "express";

import upload from "../middlewares/uploadMiddleware.js";
import adminAuthMiddleware from "../middlewares/adminAuthMiddleware.js";

import {
  uploadProductImage,
  uploadCollectionImage,
  uploadProjectImage,
  uploadProjectGalleryImage,
  uploadProductGalleryImage,
} from "../controllers/uploadController.js";

const router = express.Router();

/* ============================================
   PRODUCT IMAGE
============================================ */

router.post(
  "/product-image",
  adminAuthMiddleware,
  upload.single("image"),
  uploadProductImage
);

/* ============================================
   COLLECTION IMAGE
============================================ */

router.post(
  "/collection-image",
  adminAuthMiddleware,
  upload.single("image"),
  uploadCollectionImage
);

/* ============================================
   PROJECT IMAGE
============================================ */

router.post(
  "/project-image",
  adminAuthMiddleware,
  upload.single("image"),
  uploadProjectImage
);

/* ============================================
   PROJECT GALLERY IMAGE
============================================ */

router.post(
  "/project-gallery-image",
  adminAuthMiddleware,
  upload.single("image"),
  uploadProjectGalleryImage
);

/* ============================================
   PRODUCT GALLERY IMAGE
============================================ */

router.post(
  "/product-gallery-image",
  adminAuthMiddleware,
  upload.single("image"),
  uploadProductGalleryImage
);

export default router;