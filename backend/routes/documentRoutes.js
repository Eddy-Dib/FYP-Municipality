import express from "express";

import {getDocumentTypes, uploadDocuments, uploadComplaintDocuments, uploadRequestDocuments} from "../controllers/documentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/types", getDocumentTypes);

router.post("/upload", authMiddleware, upload.array("files", 5), uploadDocuments);

router.post("/complaints/:id/upload", authMiddleware, upload.array("documents", 5), uploadComplaintDocuments);
router.post("/request/:id/upload", authMiddleware, upload.array("files", 5), uploadRequestDocuments);

export default router;