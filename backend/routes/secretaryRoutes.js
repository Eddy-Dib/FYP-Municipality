import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import { getSubmittedRequests, getRequestDetails, getRequestDocuments, approveRequest, rejectRequest, getValidationDocuments, validateDocument, rejectDocument, getEvents, createEvent, cancelEvent, updateEvent, createAnnouncement, updateAnnouncement, getAnnouncements, cancelAnnouncement } from "../controllers/secretaryController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/requests", getSubmittedRequests);
router.get("/requests/:id", getRequestDetails);
router.get("/requests/:id/documents", getRequestDocuments);
router.post("/requests/:id/approve", approveRequest);
router.post("/requests/:id/reject", rejectRequest);
router.get("/documents", getValidationDocuments);
router.patch("/documents/:id/validate", validateDocument);
router.patch("/documents/:id/reject", rejectDocument);
router.get("/events", getEvents);
router.post("/events", createEvent);
router.patch("/events/:id/cancel", cancelEvent);
router.put("/events/:id", updateEvent);
router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);
router.put("/announcements/:id", updateAnnouncement);
router.patch("/announcements/:id/cancel", cancelAnnouncement);

export default router;