import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";


export const createRequest = (req, res) => {//create request
    try {
        const {
            title,
            type,
            otherType,
            fullName,
            phones,
            email,
            address,
            description,
            urgency,
            citizenId
        } = req.body;

        const query = `
            INSERT INTO REQUEST 
            (DateMade, Description, Priority, RType_ID, RStat_Code, C_ID)
            VALUES (NOW(), ?, ?, ?, ?, ?)
        `;

        const jsonData = JSON.stringify({
            title,
            otherType,
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
                citizenId || 1
            ],
            (err, result) => {
                if (err) {
                    return sendError(res, 500, "Database error", err.message);
                }

                return sendSuccess(res, "Request created successfully", result);
            }
        );

    } catch (err) {
        return sendError(res, 500, "Database error", err.message);
    }
};

export const getRequests = (req, res) => {//to get request 
    const query = "SELECT * FROM REQUEST ORDER BY DateMade DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.log("🔥 MYSQL ERROR:", err);
            return sendError(res, 500, "Database error", err.sqlMessage || err.message);
        }
        return sendSuccess(res, "Request created successfully", result);
    });
};