import express from "express";
import { createRequest, getRequests, getRequestTypes } from "../controllers/requestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/", authMiddleware, getRequests);
router.get("/types", getRequestTypes);

export default router;