import express from "express";
import { createRequest, getRequests } from "../controllers/requestController.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);

export default router;