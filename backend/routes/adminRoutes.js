import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getUsersByStatus,
    approveUser,
    rejectUser,
    getRoles,
    getEmployees,
    assignRole
} from "../controllers/adminController.js";

const router = express.Router();

// USER MANAGEMENT
router.get("/users/:status", authMiddleware, getUsersByStatus);
router.put("/users/:id/approve", authMiddleware, approveUser);
router.put("/users/:id/reject", authMiddleware, rejectUser);

// ASSIGN ROLES
router.get("/roles", authMiddleware, getRoles);
router.get("/employees", authMiddleware, getEmployees);
router.put("/assign-role", authMiddleware, assignRole);

export default router;