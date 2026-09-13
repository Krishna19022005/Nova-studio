import express from "express";

import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:slug", getProductBySlug);

router.post("/", createProduct);

router.put("/:slug", updateProduct);

router.delete("/:slug", deleteProduct);

export default router;