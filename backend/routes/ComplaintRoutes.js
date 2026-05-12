import express from "express";
import { createComplaint, getComplaintTypes, sendMessage } from "../controllers/complaintsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {upload} from "../middleware/uploadMiddleware.js"

const router = express.Router();

router.post("/message", sendMessage);

// Create complaint (logged in citizen only)
router.post("/createcomplaint", authMiddleware, createComplaint);

router.get("/types", getComplaintTypes);

export default router;