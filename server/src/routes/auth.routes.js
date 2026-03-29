import { Router } from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

// Public routes — no token needed
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// Protected routes — must be logged in
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

export default router;