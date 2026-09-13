import jwt from "jsonwebtoken";

export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (
      username !== validUsername ||
      password !== validPassword
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials.",
      });
    }

    const token = jwt.sign(
      {
        username: validUsername,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        admin: {
          username: validUsername,
          role: "admin",
        },
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
}