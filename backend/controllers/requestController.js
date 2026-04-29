import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

/* =========================
   GET REQUESTS (Mayor view)
   only 3 (Validated) + 7 (In Progress)
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
export const createRequest = (req, res) => {
export const createRequest = async (req, res) => {
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
        if (!type) {
            return sendError(res, 400, "Request type is required", "NO_TYPE");
        }

        const [typeRows] = await db.promise().query(
            `SELECT RType_ID FROM REQUEST_TYPES WHERE RType_ID = ?`,
            [type]
        );

        if (!typeRows.length) {
            return sendError(res, 400, "Invalid request type", "INVALID_TYPE");
        }

        const jsonData = JSON.stringify({
            title,
            fullName,
            phones,
            email,
            address,
            description
        });

        const [result] = await db.promise().query(
            `INSERT INTO REQUEST 
            (DateMade, Description, Priority, RType_ID, RStat_Code, C_ID)
            VALUES (NOW(), ?, ?, ?, ?, ?)`,
            [
                jsonData,
                urgency ?? 0,
                type,
                1,
                citizenId
            ]
        );

        return sendSuccess(res, "Request created successfully", {
            insertId: result.insertId
        });

    } catch (err) {
        return sendError(res, 500, "Server error", err.message);
    }
};

/* =========================
   GET TYPES
export const getRequestTypes = (req, res) => {
    const query = "SELECT * FROM REQUEST_TYPES";

    db.query(query, (err, results) => {
        if (err) {
            return sendError(res, 500, "Error", err.message);
        }

        return sendSuccess(res, "Types fetched", results || []);
    });
        console.error("CREATE REQUEST ERROR:", err);
        return sendError(res, 500, "Database error", err.message);
    }
};

export const getRequests = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT 
                r.Req_ID,
                r.DateMade,
                r.Description,
                r.Priority,
                rs.RStat_Name,
                rt.RType_Name,

                CONCAT(
                    'REQ-',
                    DATE_FORMAT(r.DateMade, '%y'),
                    LPAD(rt.RType_ID, 2, '0'),
                    LPAD(r.Req_ID, 3, '0')
                ) AS RequestNumber

            FROM REQUEST r
            JOIN REQ_STATUSES rs ON r.RStat_Code = rs.RStat_Code
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            ORDER BY r.DateMade DESC`
        );

        return sendSuccess(res, "Requests fetched successfully", rows);

    } catch (err) {
        console.error("GET REQUESTS ERROR:", err);
        return sendError(res, 500, "Database error", err.message);
    }
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
export const getRequestTypes = async (req, res) => {
    try {
        const [results] = await db.promise().query(
            `SELECT RType_ID, RType_Name 
             FROM REQUEST_TYPES
             ORDER BY RType_ID`
        );

        return sendSuccess(res, "Request types fetched successfully", results);

    } catch (err) {
        console.error("GET TYPES ERROR:", err);
        return sendError(res, 500, "Failed to fetch request types", err.message);
    }
};