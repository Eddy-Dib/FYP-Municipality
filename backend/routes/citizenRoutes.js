import express from "express";
import { getMyProfile, registerCitizen, changePassword } from "../controllers/citizenController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { getEvents } from "../controllers/secretaryController.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.post("/register", upload.single("document"), registerCitizen);
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

router.get("/events", getEvents);

export default router;