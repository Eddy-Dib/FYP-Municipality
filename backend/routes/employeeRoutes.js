import express from "express";
import { changeEmpPassword, getDashboard, getEmpProfile } from "../controllers/employeeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTaskDetails, updateTaskStatus, getTaskHistory } from "../controllers/taskController.js";
import {getComplaints, approveComplaint, rejectComplaint} from "../controllers/complaintsController.js";
import { getReportByTask, updateReport, getReportHistory, getReportById } from "../controllers/reportController.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);
router.get("/tasks/history", authMiddleware, getTaskHistory);
router.get("/tasks/:id", authMiddleware, getTaskDetails);
router.patch("/tasks/:id/status", authMiddleware, updateTaskStatus);
router.post("/changePass", authMiddleware, changeEmpPassword);
router.get("/profile", authMiddleware, getEmpProfile);

router.get("/complaints", authMiddleware, getComplaints);
router.patch("/complaints/:id/approve", authMiddleware, approveComplaint);
router.patch("/complaints/:id/reject", authMiddleware, rejectComplaint);

router.get("/report/:id", authMiddleware, getReportByTask);
router.post("/report/:taskId", authMiddleware, updateReport);
router.get("/reports/history", authMiddleware, getReportHistory);
router.get("/reports/:id", authMiddleware, getReportById);

export default router;