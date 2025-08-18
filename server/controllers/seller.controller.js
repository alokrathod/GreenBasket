import jwt from "jsonwebtoken";

// @desc    seller login
// @route   POST /api/seller/login
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body();

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    // 1. check the credentials
    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ message: "Login successful", success: true });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.log("Error in sellerLoginController", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// @desc    check seller
// @route   GET /api/seller/is-auth
export const checkAuthSeller = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", success: false });
  }
};

// @desc    seller logout
// @route   GET /api/seller/logout
export const logoutSeller = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
