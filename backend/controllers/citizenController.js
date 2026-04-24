import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const getMyProfile = (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 401, "Unauthorized", "NO_USER");
        }

        const query = `
            SELECT 
                CONCAT(c.First_Name, ' ', c.Last_Name) AS FullName,
                c.Email,
                c.Phone_Num,

                CONCAT(
                    ci.City_Name, ' - ',
                    s.Street_Name, ' - ',
                    b.Building_Name, ' - floor ',
                    l.Floor
                ) AS Address

            FROM CITIZEN c
            LEFT JOIN LOCATION l ON c.Location_ID = l.Location_ID
            LEFT JOIN BUILDING b ON l.Building_ID = b.Building_ID
            LEFT JOIN STREET s ON b.Street_ID = s.Street_ID
            LEFT JOIN CITY ci ON s.City_ID = ci.City_ID

            WHERE c.U_ID = ?
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                return sendError(res, 500, "Database error", err.message);
            }

            if (!results.length) {
                return sendError(res, 404, "Citizen not found", "NO_CITIZEN");
            }

            return sendSuccess(res, "Profile fetched", results[0]);
        });

    } catch (err) {
        return sendError(res, 500, "Server error", err.message);
    }
};