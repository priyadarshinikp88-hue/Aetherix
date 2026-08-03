import express from "express";
import { phoneLogin } from "../controllers/phoneAuthController.js";

const router = express.Router();

router.post("/verify-phone", phoneLogin);

export default router;