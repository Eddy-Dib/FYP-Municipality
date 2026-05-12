import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { formatRequestNumber } from "../utils/formats.js";

export const getMyRequestsAndComplaints = async (req, res) => {
    try {
        const userId = req.user.id;

        // get citizen id
        const [citizen] = await db.promise().query(
            `SELECT C_ID FROM CITIZEN WHERE U_ID = ?`,
            [userId]
        );

        if (!citizen.length) {
            return sendError(res, 404, "Citizen not found");
        }

        const citizenId = citizen[0].C_ID;

        // REQUESTS
        const [requests] = await db.promise().query(
            `
            SELECT 
                r.Req_ID,
                r.DateMade,
                r.Priority,
                r.RType_ID,
                rs.RStat_Name,
                rt.RType_Name
            FROM REQUEST r
            JOIN REQ_STATUSES rs ON r.RStat_Code = rs.RStat_Code
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            WHERE r.C_ID = ?
            ORDER BY r.DateMade DESC
            `,
            [citizenId]
        );

        const formattedRequests = requests.map(r => ({
            ...r,
            Request_Number: formatRequestNumber({
                date: r.DateMade,
                requestTypeId: r.RType_ID,
                requestId: r.Req_ID
            })
        }));

        // COMPLAINTS
        const [complaints] = await db.promise().query(
            `
            SELECT 
                c.Cmpt_ID,
                c.Subject,
                c.DateMade,
                c.DateResolved,
                c.DateRejected,
                ct.CType_Name
            FROM COMPLAINT c
            JOIN COMPLAINT_TYPE ct ON c.CType = ct.CType_ID
            WHERE c.C_ID = ?
            ORDER BY c.DateMade DESC
            `,
            [citizenId]
        );

        return sendSuccess(res, "My requests fetched successfully", {
            requests: formattedRequests,
            complaints
        });

    } catch (err) {
        console.log("MY REQUESTS ERROR:", err);
        return sendError(res, 500, "Server error", err.message);
    }
};