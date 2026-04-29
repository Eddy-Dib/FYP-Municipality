import express from "express";
import {
    createRequest,
    getRequests,
    getRequestTypes,
    updateRequestStatus
} from "../controllers/requestController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/", authMiddleware, getRequests);
router.get("/types", getRequestTypes);
router.patch("/:id/status", authMiddleware, updateRequestStatus);

export default router;