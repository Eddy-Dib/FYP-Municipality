import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const sendMessage = (req, res) => {
    const { message, C_ID } = req.body;

    if (!message) {
        return res.json({
            success: false,
            message: "Message is required",
            data: null,
            error: "Missing message"
        });
    }

    if (!C_ID) {
        return res.json({
            success: false,
            message: "Citizen ID is required",
            data: null,
            error: "Missing C_ID"
        });
    }

    const query = `
        INSERT INTO COMPLAINT 
        (Subject, Details, DateMade, C_ID)
        VALUES (?, ?, NOW(), ?)
    `;

    db.query(query, ["message", message, C_ID], (err, result) => {
        if (err) {
            return res.json({
                success: false,
                message: "Database error",
                data: null,
                error: err.message
            });
        }

        return res.json({
            success: true,
            message: "Message sent successfully to secretary",
            data: result,
            error: null
        });
    });
};

export const createComplaint = async (req, res) => {
    const citizenId = req.user?.id;
    const { subject, details } = req.body;

    // 🔒 Auth check
    if (!req.user) {
        return sendError(res, 401, "Unauthorized access", "NO_USER_CONTEXT");
    }

    if (!citizenId) {
        return sendError(res, 401, "Invalid user session", "INVALID_USER_ID");
    }

    // 📝 Validation
    if (!subject || !details) {
        return sendError(res, 400, "Subject and details are required", "MISSING_FIELDS");
    }

    try {
        const [result] = await db.promise().query(
            `INSERT INTO COMPLAINT (Subject, Details, DateMade, C_ID)
             VALUES (?, ?, NOW(), ?)`,
            [subject, details, citizenId]
        );

        return sendSuccess(res, "Complaint created successfully", {
            Cmpt_ID: result.insertId
        });

    } catch (err) {
        console.error("CREATE COMPLAINT ERROR:", err);
        return sendError(res, 500, "Failed to create complaint", "COMPLAINT_SERVER_ERROR");
    }
};