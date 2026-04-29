import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

/* =========================
   GET REQUESTS (Mayor view)
   only 3 (Validated) + 7 (In Progress)
========================= */
export const getRequests = (req, res) => {
    const query = `
        SELECT * FROM REQUEST
        WHERE RStat_Code IN (3,7)
        ORDER BY DateMade DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return sendError(res, 500, "Database error", err.message);
        }

        return sendSuccess(res, "Requests fetched successfully", results || []);
    });
};

/* =========================
   CREATE REQUEST (Citizen)
========================= */
export const createRequest = (req, res) => {
    try {
        const { description, type } = req.body;
        const citizenId = req.user?.id;

        if (!citizenId) {
            return sendError(res, 401, "Unauthorized", "NO_USER");
        }

        const query = `
            INSERT INTO REQUEST
            (DateMade, Description, Priority, RType_ID, RStat_Code, C_ID)
            VALUES (NOW(), ?, 1, ?, 3, ?)
        `;

        db.query(query, [JSON.stringify(description), type, citizenId], (err, result) => {
            if (err) {
                return sendError(res, 500, "Database error", err.message);
            }

            return sendSuccess(res, "Request created", {
                insertId: result.insertId
            });
        });

    } catch (err) {
        return sendError(res, 500, "Server error", err.message);
    }
};

/* =========================
   GET TYPES
========================= */
export const getRequestTypes = (req, res) => {
    const query = "SELECT * FROM REQUEST_TYPES";

    db.query(query, (err, results) => {
        if (err) {
            return sendError(res, 500, "Error", err.message);
        }

        return sendSuccess(res, "Types fetched", results || []);
    });
};

/* =========================
   APPROVE / REJECT REQUEST
   THIS WAS MISSING (MAIN FIX)
========================= */
export const updateRequestStatus = (req, res) => {
    const { id } = req.params;
    const { action } = req.body;

    let newStatus = null;

    if (action === "approve") {
        newStatus = 8; // Completed
    } else if (action === "reject") {
        newStatus = 6; // Rejected
    } else {
        return sendError(res, 400, "Invalid action", "INVALID_ACTION");
    }

    const query = `
        UPDATE REQUEST
        SET RStat_Code = ?, DateCompleted = NOW()
        WHERE Req_ID = ?
    `;

    db.query(query, [newStatus, id], (err, result) => {
        if (err) {
            return sendError(res, 500, "Database error", err.message);
        }

        return sendSuccess(res, "Status updated", result);
    });
};