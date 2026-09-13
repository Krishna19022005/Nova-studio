import Product from "../models/Product.js";
import Collection from "../models/Collection.js";
import Project from "../models/Project.js";

const getDashboardStats = async (req, res) => {
  try {
    const [products, collections, projects] =
      await Promise.all([
        Product.countDocuments(),
        Collection.countDocuments(),
        Project.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        collections,
        projects,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
      error: error.message,
    });
  }
};

export {
  getDashboardStats,
};