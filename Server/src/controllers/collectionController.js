import Collection from "../models/Collection.js";

/* =========================================
   GET ALL ACTIVE COLLECTIONS
========================================= */

export async function getCollections(req, res) {
  try {
    const collections = await Collection.find({
      isActive: true,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    console.error(
      "Get collections error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch collections.",
    });
  }
}


/* =========================================
   GET COLLECTION BY SLUG
========================================= */

export async function getCollectionBySlug(
  req,
  res
) {
  try {
    const { slug } = req.params;

    const collection = await Collection.findOne({
      slug,
      isActive: true,
    });

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
      "Get collection error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch collection.",
    });
  }
}


/* =========================================
   CREATE COLLECTION
========================================= */

export async function createCollection(
  req,
  res
) {
  try {
    const {
      name,
      slug,
      tagline,
      description,
      imageUrl,
      number,
    } = req.body;

    if (
      !name ||
      !slug ||
      !tagline ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, slug, tagline and description are required.",
      });
    }

    const existingCollection =
      await Collection.findOne({
        slug: slug.toLowerCase(),
      });

    if (existingCollection) {
      return res.status(409).json({
        success: false,
        message:
          "A collection with this slug already exists.",
      });
    }

    const collection =
      await Collection.create({
        name,
        slug: slug.toLowerCase(),
        tagline,
        description,
        imageUrl: imageUrl || "",
        number: number || "",
      });

    res.status(201).json({
      success: true,
      message: "Collection created successfully.",
      data: collection,
    });
  } catch (error) {
    console.error(
      "Create collection error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create collection.",
    });
  }
}


/* =========================================
   UPDATE COLLECTION
========================================= */

export async function updateCollection(
  req,
  res
) {
  try {
    const { slug } = req.params;

    const collection =
      await Collection.findOne({
        slug,
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    const {
      name,
      newSlug,
      tagline,
      description,
      imageUrl,
      number,
      isActive,
    } = req.body;

    if (name !== undefined) {
      collection.name = name;
    }

    if (newSlug !== undefined) {
      const normalizedSlug =
        newSlug.toLowerCase().trim();

      if (normalizedSlug !== collection.slug) {
        const duplicate =
          await Collection.findOne({
            slug: normalizedSlug,
          });

        if (duplicate) {
          return res.status(409).json({
            success: false,
            message:
              "Another collection already uses this slug.",
          });
        }

        collection.slug = normalizedSlug;
      }
    }

    if (tagline !== undefined) {
      collection.tagline = tagline;
    }

    if (description !== undefined) {
      collection.description = description;
    }

    if (imageUrl !== undefined) {
      collection.imageUrl = imageUrl;
    }

    if (number !== undefined) {
      collection.number = number;
    }

    if (isActive !== undefined) {
      collection.isActive = isActive;
    }

    await collection.save();

    res.status(200).json({
      success: true,
      message: "Collection updated successfully.",
      data: collection,
    });
  } catch (error) {
    console.error(
      "Update collection error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update collection.",
    });
  }
}


/* =========================================
   DELETE COLLECTION
========================================= */

export async function deleteCollection(
  req,
  res
) {
  try {
    const { slug } = req.params;

    const collection =
      await Collection.findOneAndDelete({
        slug,
      });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete collection error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete collection.",
    });
  }
}