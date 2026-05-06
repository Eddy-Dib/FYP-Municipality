import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {getMayorRequests, getMayorRequestDetails} from "../controllers/mayorController.js";

const router = express.Router();

router.get("/requests", authMiddleware, getMayorRequests);
router.get("/requests/:id", authMiddleware, getMayorRequestDetails);

export default router;