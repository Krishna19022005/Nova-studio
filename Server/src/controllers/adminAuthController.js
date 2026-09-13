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

    const ADMIN_LOGIN_ID =
      process.env.ADMIN_LOGIN_ID || "admin";

    const ADMIN_PASSWORD =
      process.env.ADMIN_PASSWORD || "admin123";

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

    if (!loginId?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Login ID is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const validLoginId =
      loginId.trim() === ADMIN_LOGIN_ID;

    let validPassword = false;

    if (process.env.ADMIN_PASSWORD_HASH) {
      validPassword = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
      );
    } else {
      validPassword =
        password === ADMIN_PASSWORD;
    }

    if (!validLoginId || !validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Login ID or password.",
      });
    }

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
      message: "Unable to process admin login.",
    });
  }
};