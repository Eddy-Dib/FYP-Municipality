import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { formatDate } from "../utils/formats.js";
import { formatRequestNumber } from "../utils/formats.js";

export const getMayorRequests = async (req, res) => {
    const empId = req.user?.empId;

    if (!req.user) {
        return sendError(res, 401, "Unauthorized access", "NO_USER_CONTEXT");
    }

    if (!req.user.isEmployee) {
        return sendError(res, 403, "Access denied: employees only", "NOT_EMPLOYEE");
    }

    if (!empId) {
        return sendError(res, 401, "Invalid user session", "INVALID_USER_ID");
    }

    try {

        const [rows] = await db.promise().query(`
            SELECT 
                r.Req_ID,
                r.DateMade,
                r.Description,
                r.Priority,
                r.FlagRejected,

                rs.RStat_Name,
                rt.RType_Name,

                t.Task_ID,
                t.DateCompleted AS TaskCompletedAt,
                ts.TStat_Name,

                rep.Report_ID,
                rep.Title AS ReportTitle,
                rep.Description AS ReportContent,

                rt.RType_ID AS RequestTypeId

            FROM REQUEST r
            JOIN REQ_STATUSES rs ON r.RStat_Code = rs.RStat_Code
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID

            JOIN TASK t ON t.Req_ID = r.Req_ID
            JOIN TASK_STATUSES ts ON t.TStat_Code = ts.TStat_Code

            JOIN REPORT rep ON rep.Task_ID = t.Task_ID

            LEFT JOIN ISSUED_DOCUMENT i ON i.Req_ID = r.Req_ID

            WHERE 
                ts.TStat_Name = 'Completed'
                AND t.DateCompleted IS NOT NULL
                AND i.IssDoc_ID IS NULL
                AND r.FlagRejected = 0

            ORDER BY t.DateCompleted DESC
        `);

        const formatted = rows.map(row => {
            let description = row.Description;

            if (typeof description === "string") {
                try {
                    description = JSON.parse(description);
                } catch (e) {
                    description = description;
                }
            }

            return {
                ...row,

                DateMade: formatDate(row.DateMade),
                TaskCompletedAt: formatDate(row.TaskCompletedAt),

                RequestNumber: formatRequestNumber({
                    date: row.DateMade,
                    requestTypeId: row.RequestTypeId,
                    requestId: row.Req_ID
                }),

                Description: description,

                Priority:
                    row.Priority >= 2
                        ? "High"
                        : row.Priority === 1
                            ? "Medium"
                            : "Low",

                report: row.Report_ID
                    ? {
                        id: row.Report_ID,
                        title: row.ReportTitle,
                        description: row.ReportContent
                    }
                    : null
            };
        });

        return sendSuccess(
            res,
            "Mayor review requests fetched successfully",
            formatted
        );

    } catch (err) {
        console.error("MAYOR REVIEW ERROR:", err);
        return sendError(res, 500, "Failed to fetch mayor requests", "MAYOR_REQUESTS_ERROR");
    }
};


export const getMayorRequestDetails = async (req, res) => {
    const empId = req.user?.empId;
    const reqId = Number(req.params.id);

    if (!req.user) {
        return sendError(res, 401, "Unauthorized access", "NO_USER_CONTEXT");
    }

    if (!req.user.isEmployee) {
        return sendError(res, 403, "Access denied: employees only", "NOT_EMPLOYEE");
    }

    if (!empId) {
        return sendError(res, 401, "Invalid user session", "INVALID_USER_ID");
    }

    if (!Number.isInteger(reqId) || reqId <= 0) {
        return sendError(res, 400, "Invalid request id", "BAD_REQUEST_ID");
    }

    try {
        const [rows] = await db.promise().query(
            `
            SELECT 
                r.Req_ID,
                r.DateMade,
                r.Description,
                r.Priority,
                r.FlagRejected,

                rs.RStat_Name,
                rt.RType_Name,
                rt.RType_ID,

                t.Task_ID,
                t.DateCompleted AS TaskCompletedAt,

                rep.Report_ID,
                rep.Title AS ReportTitle,
                rep.Description AS ReportContent

            FROM REQUEST r
            JOIN REQ_STATUSES rs ON r.RStat_Code = rs.RStat_Code
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            JOIN TASK t ON t.Req_ID = r.Req_ID
            LEFT JOIN REPORT rep ON rep.Task_ID = t.Task_ID

            WHERE r.Req_ID = ?
            LIMIT 1
            `,
            [reqId]
        );

        if (!rows.length) {
            return sendError(res, 404, "Request not found", "REQUEST_NOT_FOUND");
        }

        const row = rows[0];

        let description = row.Description;

        if (typeof description === "string") {
            try {
                description = JSON.parse(description);
            } catch { }
        }

        return sendSuccess(res, "Request details loaded", {
            request: {
                id: row.Req_ID,

                requestNumber: formatRequestNumber({
                    date: row.DateMade,
                    requestTypeId: row.RType_ID,
                    requestId: row.Req_ID
                }),

                type: row.RType_Name,
                status: row.RStat_Name,
                priority:
                    row.Priority >= 2 ? "High" :
                        row.Priority === 1 ? "Medium" : "Low",
                dateMade: row.DateMade,
                description
            },

            report: row.Report_ID
                ? {
                    id: row.Report_ID,
                    title: row.ReportTitle,
                    description: row.ReportContent
                }
                : null
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to load request", "REQUEST_DETAILS_ERROR");
    }
};