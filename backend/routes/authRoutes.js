import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controllers/authController.js";

const router = express.Router();

console.log("✅ authRoutes.js Loaded");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    message: "Auth Route Working",
  });
});

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Phone OTP
router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

export default router;