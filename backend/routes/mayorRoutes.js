import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {getMayorRequests, getMayorRequestDetails, finalApproveRequest, getOperationsOverview} from "../controllers/mayorController.js";

const router = express.Router();

router.get("/requests", authMiddleware, getMayorRequests);
router.get("/requests/:id", authMiddleware, getMayorRequestDetails);
router.post("/requests/:id/approve", authMiddleware, finalApproveRequest);
router.get("/overview", authMiddleware, getOperationsOverview);
export default router;