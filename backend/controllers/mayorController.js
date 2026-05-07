import db from "../config/db.js";
import path from "path";
import { sendSuccess, sendError } from "../utils/responses.js";
import { formatDate, formatRequestNumber } from "../utils/formats.js";
import { createIssuedDocumentFile } from "../utils/officialDoc/generateOfficialDoc.js"
import { sendRequestStatusEmail } from "../utils/notificationService.js";

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

export const finalApproveRequest = async (req, res) => {
    const empId = req.user?.empId;
    const reqId = Number(req.params.id);

    if (!req.user || !req.user.isEmployee) {
        return sendError(res, 403, "Access denied", "NOT_EMPLOYEE");
    }

    if (!empId) {
        return sendError(res, 401, "Invalid session", "INVALID_USER_ID");
    }

    if (!Number.isInteger(reqId) || reqId <= 0) {
        return sendError(res, 400, "Invalid request id", "BAD_REQUEST_ID");
    }

    const conn = await db.promise().getConnection();

    let emailPayload = null;

    try {
        await conn.beginTransaction();

        const [[request]] = await conn.query(
            `
            SELECT 
                r.Req_ID,
                r.DateMade,
                r.RType_ID,
                r.RStat_Code,
                rt.RType_Name,
                c.C_ID,
                c.First_Name,
                c.Last_Name,
                DATE_FORMAT(c.BirthDate, '%d-%m-%Y') AS BirthDate,
                c.Email
            FROM REQUEST r
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            JOIN CITIZEN c ON r.C_ID = c.C_ID
            WHERE r.Req_ID = ?
            LIMIT 1
            `,
            [reqId]
        );

        if (!request) {
            await conn.rollback();
            return sendError(res, 404, "Request not found", "NOT_FOUND");
        }

        const [[existing]] = await conn.query(
            `SELECT IssDoc_ID FROM ISSUED_DOCUMENT WHERE Req_ID = ?`,
            [reqId]
        );

        if (existing) {
            await conn.rollback();
            return sendError(res, 400, "Document already issued", "ALREADY_ISSUED");
        }

        const requestNumber = formatRequestNumber({
            date: request.DateMade,
            requestTypeId: request.RType_ID,
            requestId: request.Req_ID
        });

        if (!requestNumber) {
            await conn.rollback();
            return sendError(res, 500, "Failed to generate request number", "FORMAT_ERROR");
        }

        const filePath = await createIssuedDocumentFile({
            request: {
                Req_ID: request.Req_ID,
                RequestNumber: requestNumber,
                RType_Name: request.RType_Name
            },
            citizen: request,
            mayorName: req.user.name || "Mayor",
            docRoot: process.env.DOC_ROOT
        });

        await conn.query(
            `
            INSERT INTO ISSUED_DOCUMENT
            (Title, Content, DateIssued, Req_ID, Created_By, Approved_By)
            VALUES (?, ?, NOW(), ?, ?, ?)
            `,
            [
                request.RType_Name,
                filePath,
                request.Req_ID,
                empId,
                empId
            ]
        );

        await conn.query(
            `
            UPDATE REQUEST
            SET RStat_Code = 8
            WHERE Req_ID = ?
            `,
            [reqId]
        );

        const relativePath = path.relative(path.join(process.env.DOC_ROOT, "municipality"), filePath).replace(/\\/g, "/");
        const fileURL = `${process.env.BASE_URL}/issued-docs/${relativePath}`;

        emailPayload = {
            email: request.Email,
            status: "completed",
            requestNumber,
            reqId,
            title: request.RType_Name,
            attachments: [
                {
                    filename: `document-${requestNumber}.pdf`,
                    path: filePath
                }
            ]
        };

        await conn.commit();

        return sendSuccess(res, "Request approved successfully", {
            requestId: reqId,
            requestNumber,
            fileURL
        });

    } catch (err) {
        await conn.rollback();
        console.error("APPROVE ERROR:", err);
        return sendError(res, 500, "Approval failed", "APPROVAL_ERROR");

    } finally {
        conn.release();

        if (emailPayload) {
            setImmediate(async () => {
                try {
                    await sendRequestStatusEmail(emailPayload);
                } catch (e) {
                    console.error("EMAIL FAILED:", e);
                }
            });
        }
    }
};