import express from "express";

import {
    getDocumentTypes,
    uploadDocuments
} from "../controllers/documentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/types", getDocumentTypes);

router.post(
    "/upload",
    authMiddleware,
    upload.array("files", 5),
    uploadDocuments
);

export default router;