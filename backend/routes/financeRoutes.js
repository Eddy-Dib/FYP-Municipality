import express from "express";
import { getFeeSettingsOverview, getLocationTypes, addFee, editFee, toggleFee } from "../controllers/financeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/locations", authMiddleware, getLocationTypes);
router.get("/settings", authMiddleware, getFeeSettingsOverview)
router.post("/fees", authMiddleware, addFee);
router.put("/fees/:id", authMiddleware, editFee);
router.patch("/fees/:id/toggle", authMiddleware, toggleFee);
export default router;