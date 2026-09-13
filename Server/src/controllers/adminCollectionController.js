import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
/* ============================================
   GET ALL COLLECTIONS
   ============================================ */

export const getAdminCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error(
      "Get admin collections error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load collections.",
    });
  }
};

/* ============================================
   CREATE COLLECTION
   ============================================ */

export const createAdminCollection = async (
  req,
  res
) => {
  try {
    const {
      name,
      slug,
      tagline,
      description,
      imageUrl,
      number,
      isActive,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Collection name is required.",
      });
    }

    if (!slug?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Collection slug is required.",
      });
    }

    if (!tagline?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Collection tagline is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Collection description is required.",
      });
    }

    const collection =
      await Collection.create({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        tagline: tagline.trim(),
        description: description.trim(),
        imageUrl: imageUrl?.trim() || "",
        number: number?.trim() || "",
        isActive: isActive !== false,
      });

    res.status(201).json({
      success: true,
      message:
        "Collection created successfully.",
      data: collection,
    });
  } catch (error) {
    console.error(
      "Create admin collection error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A collection with this slug already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to create collection.",
    });
  }
};

/* ============================================
   DELETE COLLECTION
   ============================================ */

export const deleteAdminCollection = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const collection =
      await Collection.findByIdAndDelete(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Collection deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete admin collection error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete collection.",
    });
  }
};

export const getAdminCollectionProducts =
  async (req, res) => {
    try {
      const { id } = req.params;

      const collection =
        await Collection.findById(id).lean();

      if (!collection) {
        return res.status(404).json({
          success: false,
          message: "Collection not found.",
        });
      }

      const products =
        await Product.find({
          collection: collection.slug,
        })
          .sort({ createdAt: -1 })
          .lean();

      res.status(200).json({
        success: true,
        collection,
        products,
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
  export const getAdminCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id).lean();

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error(
      "Get admin collection error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load collection.",
    });
  }
};