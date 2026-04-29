import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import { getSubmittedRequests, getRequestDetails, getRequestDocuments,approveRequest} from "../controllers/secretaryController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/requests", getSubmittedRequests);
router.get("/requests/:id", getRequestDetails);
router.get("/requests/:id/documents", getRequestDocuments);
router.post("/requests/:id/approve", approveRequest);

export default router;