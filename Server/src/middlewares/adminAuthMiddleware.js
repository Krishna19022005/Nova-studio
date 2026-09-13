import "dotenv/config";
import jwt from "jsonwebtoken";

const adminAuthMiddleware = (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables."
      );

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration is missing.",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

export default adminAuthMiddleware;