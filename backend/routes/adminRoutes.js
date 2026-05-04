import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    getCitizens,
    enableUser,
    disableUser,
    getRoles,
    getEmployees,
    assignRole
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/citizens", authMiddleware, getCitizens);

router.put("/users/:id/enable", authMiddleware, enableUser);
router.put("/users/:id/disable", authMiddleware, disableUser);

router.get("/roles", authMiddleware, getRoles);
router.get("/employees", authMiddleware, getEmployees);
router.put("/employees/assign-role", authMiddleware, assignRole);

export default router;