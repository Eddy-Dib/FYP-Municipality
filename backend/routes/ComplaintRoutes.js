import express from "express";
import { sendMessage, createComplaint } from "../controllers/ComplaintController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message", sendMessage);

// Create complaint (logged in citizen only)
router.post("/createcomplaint", authMiddleware, createComplaint);

export default router;