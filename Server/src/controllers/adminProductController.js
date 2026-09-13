import Product from "../models/Product.js";

/* ============================================
   GET PRODUCTS
   ============================================ */

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(
      "Get admin products error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load products.",
    });
  }
};

/* ============================================
   GET ONE PRODUCT
   ============================================ */

export const getAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "Get admin product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load product.",
    });
  }
};

/* ============================================
   GET PRODUCTS IN ONE COLLECTION
   ============================================ */

export const getProductsByCollection = async (
  req,
  res
) => {
  try {
    const { collection } = req.params;

    const products = await Product.find({
      collection: collection.toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(
      "Get collection products error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load collection products.",
    });
  }
};

/* ============================================
   CREATE PRODUCT
   ============================================ */

export const createAdminProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      slug,
      code,
      collection,
      subtitle,
      finish,
      colour,
      space,
      description,
      specs,
      imageUrl,
      gallery,
      isActive,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product slug is required.",
      });
    }

    if (!code?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product code is required.",
      });
    }

    if (!collection?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Collection is required.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      code: code.trim(),
      collection: collection.trim().toLowerCase(),
      subtitle: subtitle?.trim() || "",
      finish: finish?.trim() || "",
      colour: colour?.trim() || "",
      space: space?.trim() || "",
      description: description?.trim() || "",
      specs:
        specs &&
        typeof specs === "object"
          ? specs
          : {},
      imageUrl: imageUrl?.trim() || "",
      gallery: Array.isArray(gallery)
        ? gallery
        : [],
      isActive: isActive !== false,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.error(
      "Create admin product error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
};

/* ============================================
   DELETE PRODUCT
   ============================================ */

export const deleteAdminProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const product =
      await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete admin product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};