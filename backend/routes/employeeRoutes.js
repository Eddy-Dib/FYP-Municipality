import express from "express";
import { getDashboard } from "../controllers/employeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTaskDetails, updateTaskStatus } from "../controllers/taskController.js";
import {createComplaint, getComplaints, approveComplaint, rejectComplaint} from "../controllers/complaintsController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);
router.get("/tasks/:id", authMiddleware, getTaskDetails);
router.patch("/tasks/:id/status", authMiddleware, updateTaskStatus);

router.post("/complaints", authMiddleware, createComplaint);
router.get("/complaints", authMiddleware, getComplaints);
router.patch("/complaints/:id/approve", authMiddleware, approveComplaint);
router.delete("/complaints/:id", authMiddleware, rejectComplaint);

export default router;