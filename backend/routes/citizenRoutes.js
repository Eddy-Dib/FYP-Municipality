import express from "express";
import { getMyProfile, registerCitizen, changePassword } from "../controllers/citizenController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);
router.post("/register", upload.single("document"), registerCitizen);
router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

export default router;