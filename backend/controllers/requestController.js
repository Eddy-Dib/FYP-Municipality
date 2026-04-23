import db from "../config/db.js";
import { successResponse, errorResponse } from "../utilities/responses.js";


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
                    return errorResponse(res, "Database error", err.message);
                }

                return successResponse(res, "Request created successfully", result);
            }
        );

    } catch (err) {
        return errorResponse(res, "Server error", err.message);
    }
};

export const getRequests = (req, res) => {//to get request 
    const query = "SELECT * FROM REQUEST ORDER BY DateMade DESC";

    db.query(query, (err, results) => {
        if (err) {
            return errorResponse(res, "Database error", err.message);
        }

        return successResponse(res, "Requests fetched", results);
    });
};