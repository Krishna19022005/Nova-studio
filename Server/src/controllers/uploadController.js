import cloudinary from "../config/cloudinary.js";

function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    uploadStream.end(buffer);
  });
}

/* ============================================
   PRODUCT IMAGE
============================================ */

export async function uploadProductImage(
  req,
  res
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    const result =
      await uploadBufferToCloudinary(
        req.file.buffer,
        "nova-flooring/products"
      );

    return res.status(200).json({
      success: true,
      message:
        "Product image uploaded successfully.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error(
      "Cloudinary product image upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  }
}

/* ============================================
   COLLECTION IMAGE
============================================ */

export async function uploadCollectionImage(
  req,
  res
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    const result =
      await uploadBufferToCloudinary(
        req.file.buffer,
        "nova-flooring/collections"
      );

    return res.status(200).json({
      success: true,
      message:
        "Collection image uploaded successfully.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error(
      "Cloudinary collection image upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  }
}

/* ============================================
   PROJECT IMAGE
============================================ */

export async function uploadProjectImage(
  req,
  res
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    const result =
      await uploadBufferToCloudinary(
        req.file.buffer,
        "nova-flooring/projects"
      );

    return res.status(200).json({
      success: true,
      message:
        "Project image uploaded successfully.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error(
      "Cloudinary project image upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  }
}

/* ============================================
   PROJECT GALLERY IMAGE
============================================ */

export async function uploadProjectGalleryImage(
  req,
  res
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    const result =
      await uploadBufferToCloudinary(
        req.file.buffer,
        "nova-flooring/projects/gallery"
      );

    return res.status(200).json({
      success: true,
      message:
        "Project gallery image uploaded successfully.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error(
      "Cloudinary project gallery upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  }
}

/* ============================================
   PRODUCT GALLERY IMAGE
============================================ */

export async function uploadProductGalleryImage(
  req,
  res
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    const result =
      await uploadBufferToCloudinary(
        req.file.buffer,
        "nova-flooring/products/gallery"
      );

    return res.status(200).json({
      success: true,
      message:
        "Product gallery image uploaded successfully.",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error(
      "Cloudinary product gallery upload error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
    });
  }
}