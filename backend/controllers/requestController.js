import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const createRequest = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 401, "Unauthorized", "NO_USER");
        }

        const [citizens] = await db.promise().query(
            `SELECT C_ID
            FROM CITIZEN
            WHERE U_ID = ?`,
            [userId]
        );

        if (!citizens.length) {
            return sendError(res, 404, "Citizen profile not found", "CITIZEN_NOT_FOUND");
        }

        const citizenId = citizens[0].C_ID;
        
        const {
            title,
            type,
            fullName,
            phones,
            email,
            address,
            description,
            urgency
        } = req.body;

        if (
            !title ||
            !type ||
            !fullName ||
            !phones?.[0] ||
            !email ||
            !address
        ) {
            return sendError(res, 400, "Missing required fields", "MISSING_FIELDS");
        }

        const rTypeId = Number(type);

        if (isNaN(rTypeId)) {
            return sendError(res, 400, "Invalid request type", "INVALID_TYPE");
        }

        const priorityMap = {
            Low: 1,
            Medium: 2,
            High: 3,
            Emergency: 4
        };

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
    VALUES (NOW(), ?, ?, ?, 1, ?)`,
            [
                jsonData,
                priorityMap[urgency] || 1,
                rTypeId,
                citizenId
            ]
        );

        return sendSuccess(res, "Request created successfully", {
            insertId: result.insertId
        });

    } catch (err) {
        console.error("CREATE REQUEST ERROR:", err);
        return sendError(res, 500, "Server error", err.message);
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
            JOIN REQ_STATUSES rs 
                ON r.RStat_Code = rs.RStat_Code
            JOIN REQUEST_TYPES rt 
                ON r.RType_ID = rt.RType_ID

            ORDER BY r.DateMade DESC`
        );

        return sendSuccess(res, "Requests fetched successfully", rows);

    } catch (err) {
        console.error("GET REQUESTS ERROR:", err);
        return sendError(res, 500, "Database error", err.message);
    }
};


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

    db.query(
        `UPDATE REQUEST
         SET RStat_Code = ?, DateCompleted = NOW()
         WHERE Req_ID = ?`,
        [newStatus, id],
        (err, result) => {
            if (err) {
                return sendError(res, 500, "Database error", err.message);
            }

            return sendSuccess(res, "Status updated", result);
        }
    );
};

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