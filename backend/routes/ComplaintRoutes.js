import express from "express";
import { createComplaint, getComplaintTypes, sendMessage } from "../controllers/complaintsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {upload} from "../middleware/uploadMiddleware.js"

import { uploadComplaintDocuments } from "../controllers/documentController.js";

const router = express.Router();

router.post("/message", sendMessage);

// Create complaint (logged in citizen only)
router.post("/createcomplaint", authMiddleware, createComplaint);
router.post("/complaints/:id/documents", authMiddleware, upload.array("documents", 5), uploadComplaintDocuments);

router.get("/types", getComplaintTypes);

export default router;