import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================================
   ADMIN LOGIN
============================================ */

export const adminLogin = async (req, res) => {
  try {
    const {
      loginId,
      password,
    } = req.body;

    // ==========================================
    // ADMIN CREDENTIALS
    // ==========================================

    const ADMIN_LOGIN_ID =
      process.env.ADMIN_USERNAME || "admin";

    const ADMIN_PASSWORD =
      process.env.ADMIN_PASSWORD || "admin123";

    const JWT_SECRET =
      process.env.JWT_SECRET;

    // ==========================================
    // JWT CONFIGURATION CHECK
    // ==========================================

    if (!JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables."
      );

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration is missing.",
      });
    }

    // ==========================================
    // LOGIN ID VALIDATION
    // ==========================================

    if (!loginId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Login ID is required.",
      });
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    // ==========================================
    // CHECK LOGIN ID
    // ==========================================

    const validLoginId =
      loginId.trim() === ADMIN_LOGIN_ID;

    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    let validPassword = false;

    /*
      If ADMIN_PASSWORD_HASH exists in Render,
      it will be used.

      Otherwise ADMIN_PASSWORD will be used.
    */

    if (process.env.ADMIN_PASSWORD_HASH) {
      validPassword = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
      );
    } else {
      validPassword =
        password === ADMIN_PASSWORD;
    }

    // ==========================================
    // INVALID CREDENTIALS
    // ==========================================

    if (!validLoginId || !validPassword) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid Login ID or password.",
      });
    }

    // ==========================================
    // CREATE JWT TOKEN
    // ==========================================

    const token = jwt.sign(
      {
        loginId: ADMIN_LOGIN_ID,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // ==========================================
    // LOGIN SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        loginId: ADMIN_LOGIN_ID,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process admin login.",
    });
  }
};