import express from "express";
import { getDashboard } from "../controllers/employeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTaskDetails } from "../controllers/taskController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);
router.get("/tasks/:id", authMiddleware, getTaskDetails);

export default router;