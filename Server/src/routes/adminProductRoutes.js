import express from "express";

import {
  getAdminProducts,
  getAdminProduct,
  getProductsByCollection,
  createAdminProduct,
  deleteAdminProduct,
} from "../controllers/adminProductController.js";

const router = express.Router();

/* All products */
router.get(
  "/",
  getAdminProducts
);

/* Products belonging to a collection */
router.get(
  "/collection/:collection",
  getProductsByCollection
);

/* Single product */
router.get(
  "/:id",
  getAdminProduct
);

/* Create product */
router.post(
  "/",
  createAdminProduct
);

/* Delete product */
router.delete(
  "/:id",
  deleteAdminProduct
);

export default router;