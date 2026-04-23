import express from "express";
import { getDashboard } from "../controllers/employeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTaskDetails, updateTaskStatus } from "../controllers/taskController.js";
import {createComplaint, getComplaints, approveComplaint, rejectComplaint} from "../controllers/complaintsController.js";
import { getReportByTask, updateReport } from "../controllers/reportController.js";
import { getReportByTask, updateReport, getReportHistory } from "../controllers/reportController.js";
import { getReportByTask, updateReport, getReportHistory, getReportById } from "../controllers/reportController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);
router.get("/tasks/:id", authMiddleware, getTaskDetails);
router.patch("/tasks/:id/status", authMiddleware, updateTaskStatus);

router.post("/complaints", authMiddleware, createComplaint);
router.get("/complaints", authMiddleware, getComplaints);
router.patch("/complaints/:id/approve", authMiddleware, approveComplaint);
router.delete("/complaints/:id", authMiddleware, rejectComplaint);

router.get("/report/:id", authMiddleware, getReportByTask);
router.post("/report/:taskId", authMiddleware, updateReport);
router.get("/reports/history", authMiddleware, getReportHistory);
router.get("/reports/:id", authMiddleware, getReportById);

export default router;