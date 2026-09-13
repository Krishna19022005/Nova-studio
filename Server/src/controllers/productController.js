import Product from "../models/Product.js";


// ============================================
// GET ALL PRODUCTS
// ============================================

export async function getProducts(req, res) {
  try {
    const products = await Product.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
}


// ============================================
// GET PRODUCT BY SLUG
// ============================================

export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    });

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
    console.error("Get product by slug error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
}


// ============================================
// CREATE PRODUCT
// ============================================

export async function createProduct(req, res) {
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


    // Required fields
    if (
      !name ||
      !slug ||
      !code ||
      !collection
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, slug, code and collection are required.",
      });
    }


    const normalizedSlug =
      slug.trim().toLowerCase();


    // Check duplicate slug
    const existingProduct =
      await Product.findOne({
        slug: normalizedSlug,
      });


    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message:
          "A product with this slug already exists.",
      });
    }


    const product =
      await Product.create({
        name: name.trim(),

        slug: normalizedSlug,

        code: code.trim(),

        collection:
          collection.trim().toLowerCase(),

        subtitle:
          subtitle?.trim() || "",

        finish:
          finish?.trim() || "",

        colour:
          colour?.trim() || "",

        space:
          space?.trim() || "",

        description:
          description?.trim() || "",

        specs:
          specs || {},

        imageUrl:
          imageUrl?.trim() || "",

        gallery:
          Array.isArray(gallery)
            ? gallery
            : [],

        isActive:
          typeof isActive === "boolean"
            ? isActive
            : true,
      });


    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
}


// ============================================
// UPDATE PRODUCT
// ============================================

export async function updateProduct(req, res) {
  try {
    const { slug } = req.params;


    const product =
      await Product.findOne({
        slug: slug.toLowerCase(),
      });


    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }


    const {
      name,
      newSlug,
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


    // ----------------------------------------
    // BASIC FIELDS
    // ----------------------------------------

    if (name !== undefined) {
      product.name = name.trim();
    }


    if (code !== undefined) {
      product.code = code.trim();
    }


    if (collection !== undefined) {
      product.collection =
        collection.trim().toLowerCase();
    }


    if (subtitle !== undefined) {
      product.subtitle =
        subtitle.trim();
    }


    if (finish !== undefined) {
      product.finish =
        finish.trim();
    }


    if (colour !== undefined) {
      product.colour =
        colour.trim();
    }


    if (space !== undefined) {
      product.space =
        space.trim();
    }


    if (description !== undefined) {
      product.description =
        description.trim();
    }


    // ----------------------------------------
    // SPECIFICATIONS
    // ----------------------------------------

    if (specs !== undefined) {
      product.specs = specs;
    }


    // ----------------------------------------
    // IMAGE
    // ----------------------------------------

    if (imageUrl !== undefined) {
      product.imageUrl =
        imageUrl.trim();
    }


    // ----------------------------------------
    // GALLERY
    // ----------------------------------------

    if (gallery !== undefined) {
      product.gallery =
        Array.isArray(gallery)
          ? gallery
          : [];
    }


    // ----------------------------------------
    // ACTIVE STATUS
    // ----------------------------------------

    if (isActive !== undefined) {
      product.isActive =
        Boolean(isActive);
    }


    // ----------------------------------------
    // OPTIONAL SLUG UPDATE
    // ----------------------------------------

    if (newSlug !== undefined) {
      const normalizedNewSlug =
        newSlug.trim().toLowerCase();


      if (
        normalizedNewSlug !== product.slug
      ) {
        const slugExists =
          await Product.findOne({
            slug: normalizedNewSlug,
            _id: { $ne: product._id },
          });


        if (slugExists) {
          return res.status(409).json({
            success: false,
            message:
              "A product with this slug already exists.",
          });
        }


        product.slug =
          normalizedNewSlug;
      }
    }


    const updatedProduct =
      await product.save();


    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
}


// ============================================
// DELETE PRODUCT
// ============================================

export async function deleteProduct(req, res) {
  try {
    const { slug } = req.params;


    const product =
      await Product.findOneAndDelete({
        slug: slug.toLowerCase(),
      });


    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }


    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
}

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
      message:
        "Failed to delete product.",
    });
  }
};