import express from "express";
import {
  register,
  login,
 googleLogin,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

console.log("✅ authRoutes.js Loaded");
console.log("🔥 GOOGLE ROUTES FILE LOADED");
// Test Route
router.get("/test", (req, res) => {
  res.json({
    message: "Auth Route Working",
  });
});

router.get("/google-test", (req, res) => {
  res.json({
    message: "Google route is loaded",
  });
});
// Register
router.post("/register", register);

// Google Login
router.post("/google", googleLogin);

// Login
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Phone OTP
router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

console.log(
  "🔥 AUTH ROUTES:",
  router.stack
    .filter((r) => r.route)
    .map((r) => `${Object.keys(r.route.methods).join(",").toUpperCase()} ${r.route.path}`)
);

export default router;