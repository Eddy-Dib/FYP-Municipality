import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {getMayorRequests, getMayorRequestDetails, finalApproveRequest} from "../controllers/mayorController.js";

const router = express.Router();

router.get("/requests", authMiddleware, getMayorRequests);
router.get("/requests/:id", authMiddleware, getMayorRequestDetails);
router.post("/requests/:id/approve", authMiddleware, finalApproveRequest);
export default router;