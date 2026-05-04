import express from "express";
import { getMyProfile, registerCitizen } from "../controllers/citizenController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.post("/register", upload.single("document"), registerCitizen);

export default router;