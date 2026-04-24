import express from "express";
import { getMyProfile } from "../controllers/citizenController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);

export default router;