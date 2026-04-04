// routes/authRoutes.js
import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

// Handles POST /auth/login requests
router.post("/login", login);

export default router;