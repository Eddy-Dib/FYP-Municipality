import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMyRequestsAndComplaints } from "../controllers/myrequestsController.js";

const router = express.Router();

// GET /api/my-requests
router.get("/", authMiddleware, getMyRequestsAndComplaints);

export default router;