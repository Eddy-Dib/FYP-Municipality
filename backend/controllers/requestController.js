import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";


export const createRequest = (req, res) => {
    try {
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

        const citizenId = req.user?.id;

        if (!citizenId) {
            return sendError(res, 401, "Unauthorized", "NO_USER");
        }

        if (!type) {
            return sendError(res, 400, "Request type is required", "NO_TYPE");
        }

        const query = `
            INSERT INTO REQUEST 
            (DateMade, Description, Priority, RType_ID, RStat_Code, C_ID)
            VALUES (NOW(), ?, ?, ?, ?, ?)
        `;

        const jsonData = JSON.stringify({
            title,
            fullName,
            phones,
            email,
            address,
            description
        });

        db.query(
            query,
            [
                jsonData,
                urgency || 0,
                type,
                1,
                citizenId
            ],
            (err, result) => {
                if (err) {
                    return sendError(res, 500, "Database error", err.message);
                }

                return sendSuccess(res, "Request created successfully", {
                    insertId: result.insertId
                });
            }
        );

    } catch (err) {
        return sendError(res, 500, "Database error", err.message);
    }
};

export const getRequests = (req, res) => {
    const query = "SELECT * FROM REQUEST ORDER BY DateMade DESC";

    db.query(query, (err, results) => {
        if (err) {
            return sendError(res, 500, "Database error", err.message);
        }

        return sendSuccess(res, "Requests fetched successfully", results || []);
    });
};


export const getRequestTypes = (req, res) => {
    const query = "SELECT RType_ID, RType_Name FROM REQUEST_TYPES";

    db.query(query, (err, results) => {
        if (err) {
            return sendError(res, 500, "Failed to fetch request types", err.message);
        }

        return sendSuccess(res, "Request types fetched successfully", results || []);
    });
};