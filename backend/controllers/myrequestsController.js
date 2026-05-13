import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { formatRequestNumber } from "../utils/formats.js";

export const getMyRequestsAndComplaints = async (req, res) => {
    try {
        const userId = req.user.id;

        // GET CITIZEN ID
        const [citizen] = await db.promise().query(
            `SELECT C_ID FROM CITIZEN WHERE U_ID = ?`,
            [userId]
        );

        if (!citizen.length) {
            return sendError(res, 404, "Citizen not found");
        }

        const citizenId = citizen[0].C_ID;

        // ======================
        // REQUESTS
        // ======================
        const [requests] = await db.promise().query(
            `
            SELECT 
                r.Req_ID,
                r.DateMade,
                r.DateCompleted,
                r.Priority,
                r.Description,
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

        const formattedRequests = requests.map((r) => {
            let desc = {};

            // SAFE JSON PARSING (handles string / object / null)
            try {
                if (r.Description) {
                    desc =
                        typeof r.Description === "object"
                            ? r.Description
                            : JSON.parse(r.Description);
                }
            } catch (e) {
                desc = {};
            }

            return {
                Req_ID: r.Req_ID,
                DateMade: r.DateMade,
                DateCompleted: r.DateCompleted,
                Priority: r.Priority,
                RStat_Name: r.RStat_Name,
                RType_Name: r.RType_Name,

                // structured fields
                Title: desc.title || "",
                FullName: desc.fullName || "",
                Email: desc.email || "",
                Address: desc.address || "",
                Details: desc.description || "",
                Urgency: desc.urgency || "",
                Phones: desc.phones || [],

                Request_Number: formatRequestNumber({
                    date: r.DateMade,
                    requestTypeId: r.RType_ID,
                    requestId: r.Req_ID
                })
            };
        });

        // ======================
        // COMPLAINTS (FIXED CLEAN VERSION)
        // ======================
        const [complaints] = await db.promise().query(
            `
            SELECT 
                c.Cmpt_ID,
                c.Subject,
                c.Details,
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

        const formattedComplaints = complaints.map((c) => {
            return {
                Cmpt_ID: c.Cmpt_ID,
                Subject: c.Subject,
                CType_Name: c.CType_Name,
                DateMade: c.DateMade,
                DateResolved: c.DateResolved,
                DateRejected: c.DateRejected,

                // CLEAN FIX:
                // NEVER mix metadata (name/location) into details again
                Details: c.Details || ""
            };
        });

        // ======================
        // RESPONSE
        // ======================
        return sendSuccess(res, "My requests fetched successfully", {
            requests: formattedRequests,
            complaints: formattedComplaints
        });

    } catch (err) {
        console.log("MY REQUESTS ERROR:", err);
        return sendError(res, 500, "Server error", err.message);
    }
};