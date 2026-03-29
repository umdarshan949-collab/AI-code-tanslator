import { verifyToken } from "../utils/jwt.utils.js";
import User from "../models/User.model.js";

const authenticate = async (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this route.",
      });
    }

    // 2. Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // 3. Verify the token
    const decoded = verifyToken(token);

    // 4. Find the user and attach to request
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default authenticate;