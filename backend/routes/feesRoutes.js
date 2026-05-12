import express from "express";
import { getCitizenFees } from "../controllers/feesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET citizen fees
 */
router.get("/citizen/fees", authMiddleware, getCitizenFees);

export default router;