import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import collectionRoutes from "./routes/collectionRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import adminProjectRoutes from "./routes/adminProjectRoutes.js";
import adminCollectionRoutes from "./routes/adminCollectionRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminInquiryRoutes from "./routes/adminInquiryRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";

import inquiryRoutes from "./routes/inquiryRoutes.js";

import adminAuthMiddleware from "./middlewares/adminAuthMiddleware.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================
   MIDDLEWARE
========================================= */

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================================
   PUBLIC ROUTES
========================================= */

app.use(
  "/api/collections",
  collectionRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/uploads",
  uploadRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

/* =========================================
   PUBLIC INQUIRIES
========================================= */

app.use(
  "/api/inquiries",
  inquiryRoutes
);

/* =========================================
   ADMIN AUTH
   IMPORTANT:
   Login must remain PUBLIC.
========================================= */

app.use(
  "/api/admin/auth",
  adminAuthRoutes
);

/* =========================================
   PROTECTED ADMIN ROUTES
========================================= */

app.use(
  "/api/admin/dashboard",
  adminAuthMiddleware,
  dashboardRoutes
);

app.use(
  "/api/admin/projects",
  adminAuthMiddleware,
  adminProjectRoutes
);

app.use(
  "/api/admin/collections",
  adminAuthMiddleware,
  adminCollectionRoutes
);

app.use(
  "/api/admin/products",
  adminAuthMiddleware,
  adminProductRoutes
);

app.use(
  "/api/admin/inquiries",
  adminAuthMiddleware,
  adminInquiryRoutes
);

/* =========================================
   HEALTH CHECK
========================================= */

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "NOVA Flooring API is running.",
    });
  }
);

/* =========================================
   START SERVER
========================================= */

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`NOVA Flooring API running on port ${PORT}`);
      });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();