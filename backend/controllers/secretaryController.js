import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { formatDate, formatRequestNumber, safeParseJSON } from "../utils/formats.js";
import { getPriority } from "../utils/labels.js";
import { sendRequestStatusEmail } from "../utils/notificationService.js";
import { toPublicPath } from "../utils/documentHandler.js"
import { text } from "express";

const requireSecretary = (req, res) => {
    if (!req.user) {
        sendError(res, 401, "Unauthorized access", "NO_USER_CONTEXT");
        return false;
    }

    if (!req.user.isEmployee) {
        sendError(res, 403, "Access denied: employees only", "NOT_EMPLOYEE");
        return false;
    }

    if (req.user.role !== "Secretary" && req.user.role !== "Mayor") {
        sendError(res, 403, "Access denied: secretary and mayor only", "NOT_SECRETARY");
        return false;
    }

    return true;
};

const getRoleNameFromRequestType = (typeId) => {
    if ([1, 2, 3].includes(typeId)) return "Mayor";
    if ([4, 5, 6, 7].includes(typeId)) return "Secretary";
    if ([8, 9, 10, 11].includes(typeId)) return "Lawyer";
    if ([12, 13, 14, 15, 16].includes(typeId)) return "Engineer";
    if ([17, 18].includes(typeId)) return "Financial Staff";
    if ([19].includes(typeId)) return "Staff";
    return "Staff";
};

export const getSubmittedRequests = async (req, res) => {
    if (!requireSecretary(req, res)) return;

    try {
        const [rows] = await db.promise().query(`
            SELECT 
                r.Req_ID,
                r.DateMade,
                r.Description,
                r.Priority,
                rs.RStat_Name,
                rt.RType_ID,
                rt.RType_Name
            FROM REQUEST r
            JOIN REQ_STATUSES rs ON r.RStat_Code = rs.RStat_Code
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            WHERE r.RStat_Code IN (1,2,4)
        `);

        const formatted = rows.map(r => ({
            id: r.Req_ID,
            requestNumber: formatRequestNumber({
                date: r.DateMade,
                requestTypeId: r.RType_ID,
                requestId: r.Req_ID
            }),
            type: r.RType_Name,
            status: r.RStat_Name,
            priority: getPriority(r.Priority),
            createdAt: formatDate(r.DateMade),
            description: safeParseJSON(r.Description)
        }));

        return sendSuccess(res, "Submitted requests fetched", formatted);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to fetch requests", "REQ_FETCH_ERROR");
    }
};

export const getRequestDetails = async (req, res) => {
    if (!requireSecretary(req, res)) return;

    const { id } = req.params;
    if (!id || isNaN(id)) {
        return sendError(res, 400, "Invalid request ID", "BAD_REQUEST_ID");
    }

    try {
        const [rows] = await db.promise().query(`
            SELECT 
                r.Req_ID,
                r.DateMade,
                r.Description,
                rs.RStat_Name,
                rt.RType_ID,
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
            WHERE r.Req_ID = ?
        `, [id]);

        if (!rows.length) {
            return sendError(res, 404, "Request not found", "REQ_NOT_FOUND");
        }

        const r = rows[0];

        return sendSuccess(res, "Request details loaded", {
            id: r.Req_ID,
            requestNumber: r.RequestNumber,
            type: r.RType_Name,
            status: r.RStat_Name,
            createdAt: formatDate(r.DateMade),
            description: safeParseJSON(r.Description)
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to load request", "REQ_DETAIL_ERROR");
    }
};

export const getRequestDocuments = async (req, res) => {
    if (!requireSecretary(req, res)) return;

    const { id } = req.params;
    if (!id || isNaN(id)) {
        return sendError(res, 400, "Invalid request ID", "BAD_REQUEST_ID");
    }

    try {
        const [rows] = await db.promise().query(`
            SELECT 
                d.Doc_ID,
                d.Doc_Type,
                d.DateUploaded,
                d.FilePath,
                d.IsValid,

                dt.Doc_Type_Name

            FROM REQUEST r
            JOIN CITIZEN c ON r.C_ID = c.C_ID
            JOIN DOCUMENT d ON d.C_ID = c.C_ID
            JOIN DOC_TYPE dt ON dt.Doc_Type_ID = d.Doc_Type
            WHERE r.Req_ID = ? AND d.IsValid = 1 AND (d.ExpDate IS NULL OR d.ExpDate > NOW())
            ORDER BY d.DateUploaded DESC
        `, [id]);

        const formatted = rows.map(d => ({
            id: d.Doc_ID,
            type: d.Doc_Type_Name,
            uploadedAt: d.DateUploaded ? formatDate(new Date(d.DateUploaded)) : null,
            filePath: toPublicPath(d.FilePath),
            isValid: true,
            status: false
        }));

        return sendSuccess(res, "Documents fetched", formatted);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to fetch documents", "DOC_FETCH_ERROR");
    }
};

export const approveRequest = async (req, res) => {
    if (!requireSecretary(req, res)) return;

    const { id } = req.params;

    if (!id || isNaN(id)) {
        return sendError(res, 400, "Invalid request ID", "BAD_REQUEST_ID");
    }

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        const [reqRows] = await connection.query(
            `
            SELECT 
                r.Req_ID,
                r.RType_ID,
                r.Priority,
                rt.RType_Name,
                c.Email,
                CONCAT(
                    'REQ-',
                    DATE_FORMAT(r.DateMade, '%y'),
                    LPAD(rt.RType_ID, 2, '0'),
                    LPAD(r.Req_ID, 3, '0')
                ) AS RequestNumber
            FROM REQUEST r
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            JOIN CITIZEN c ON r.C_ID = c.C_ID
            WHERE r.Req_ID = ?
            `,
            [id]
        );

        if (!reqRows.length) {
            await connection.rollback();
            return sendError(res, 404, "Request not found", "REQ_NOT_FOUND");
        }

        const request = reqRows[0];

        const roleName = getRoleNameFromRequestType(request.RType_ID);

        const [roleRows] = await connection.query(
            `SELECT Role_ID FROM ROLES WHERE Role_Type = ?`,
            [roleName]
        );

        if (!roleRows.length) {
            await connection.rollback();
            return sendError(res, 500, "Role not found", "ROLE_NOT_FOUND");
        }

        const roleId = roleRows[0].Role_ID;

        const [empRows] = await connection.query(
            `
            SELECT 
                e.Emp_ID,
                COUNT(t.Task_ID) AS activeTasks
            FROM EMPLOYEE e
            LEFT JOIN TASK t 
                ON e.Emp_ID = t.Emp_ID 
                AND t.TStat_Code IN (1,2,3,4)
            WHERE e.Role_ID = ?
            GROUP BY e.Emp_ID
            ORDER BY activeTasks ASC, e.Emp_ID ASC
            LIMIT 1
            `,
            [roleId]
        );

        if (!empRows.length) {
            await connection.rollback();
            return sendError(res, 500, "No available employee for role", "NO_EMPLOYEE");
        }

        const empId = empRows[0].Emp_ID;

        await connection.query(
            `UPDATE REQUEST SET RStat_Code = 5 WHERE Req_ID = ?`,
            [id]
        )

        await connection.query(
            `
            INSERT INTO TASK 
            (Name, DateAssigned, Priority, TStat_Code, Emp_ID, Req_ID)
            VALUES (?, NOW(), ?, 1, ?, ?)
            `,
            [
                `${request.RType_Name} Processing`,
                request.Priority,
                empId,
                id
            ]
        );

        await connection.commit();

        try {
            await sendRequestStatusEmail({
                email: request.Email,
                status: "approved",
                requestNumber: request.RequestNumber,
                reqId: request.Req_ID,
                title: request.RType_Name,
                reason: null
            });
        } catch (e) {
            console.error("Email failed", e);
        }

        return sendSuccess(res, "Request approved and task created");

    } catch (err) {
        await connection.rollback();
        console.error("APPROVE ERROR:", err);
        return sendError(res, 500, "Failed to approve request", "APPROVE_ERROR");
    } finally {
        connection.release();
    }
};

export const rejectRequest = async (req, res) => {
    if (!requireSecretary(req, res)) return;

    const { id } = req.params;
    const { rejTitle, rejText } = req.body;

    if (!id || isNaN(id)) {
        return sendError(res, 400, "Invalid request ID", "BAD_REQUEST_ID");
    }

    if (!rejTitle?.trim() || !rejText?.trim()) {
        return sendError(res, 400, "Rejection title and message required", "MISSING_REJECTION_DATA");
    }

    try {
        const [rows] = await db.promise().query(
            `
            SELECT 
                r.Req_ID,
                r.RType_ID,
                rt.RType_Name,
                c.Email,
                CONCAT(
                    'REQ-',
                    DATE_FORMAT(r.DateMade, '%y'),
                    LPAD(rt.RType_ID, 2, '0'),
                    LPAD(r.Req_ID, 3, '0')
                ) AS RequestNumber
            FROM REQUEST r
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            JOIN CITIZEN c ON r.C_ID = c.C_ID
            WHERE r.Req_ID = ?
            `,
            [id]
        );

        if (!rows.length) {
            return sendError(res, 404, "Request not found", "REQ_NOT_FOUND");
        }

        const request = rows[0];

        const [result] = await db.promise().query(
            `
            UPDATE REQUEST 
            SET FlagRejected = 1,
                RStat_Code = 6
            WHERE Req_ID = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return sendError(res, 404, "Request not found", "REQ_NOT_FOUND");
        }

        await db.promise().query(
            `
            UPDATE TASK
            SET 
                TStat_Code = 6
                WHERE Req_ID = ?
            AND TStat_Code != 5
            `,
            [id]
        );

        try {
            await sendRequestStatusEmail({
                email: request.Email,
                status: "rejected",
                requestNumber: request.RequestNumber,
                reqId: request.Req_ID,
                title: request.RType_Name,
                reason: `${rejTitle}: ${rejText}`
            });
        } catch (e) {
            console.error("EMAIL FAILED", e);
        }

        return sendSuccess(res, "Request rejected successfully");

    } catch (err) {
        console.error("REJECT ERROR:", err);
        return sendError(res, 500, "Failed to reject request", "REJECT_ERROR");
    }
};

export const getValidationDocuments = async (req, res) => {
    try {

        const [rows] = await db.promise().query(`
            SELECT 
                d.Doc_ID,
                d.FilePath,
                d.DateUploaded,
                d.ExpDate,
                d.IsValid,
                d.IsReviewed,

                c.First_Name,
                c.Last_Name,

                dt.Doc_Type_Name

            FROM DOCUMENT d
            JOIN CITIZEN c ON d.C_ID = c.C_ID
            JOIN DOC_TYPE dt ON d.Doc_Type = dt.Doc_Type_ID

            WHERE d.IsReviewed = 0
              AND d.IsValid = 1
              AND (d.ExpDate IS NULL OR d.ExpDate > NOW())

            ORDER BY d.DateUploaded ASC
        `);

        const formatted = rows.map(doc => ({
            ...doc, FilePath: toPublicPath(doc.FilePath)
        }))

        return sendSuccess(res, "Documents fetched successfully", formatted);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to fetch documents", "SERVER_ERROR");
    }
};

export const validateDocument = async (req, res) => {
    try {
        const docId = req.params.id;

        const [result] = await db.promise().query(
            `
            UPDATE DOCUMENT
            SET 
                IsValid = 1,
                IsReviewed = 1
            WHERE Doc_ID = ?
            `,
            [docId]
        );

        if (result.affectedRows === 0) {
            return sendError(res, 404, "Document not found", "NOT_FOUND");
        }

        return sendSuccess(res, "Document validated successfully");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to validate document", "SERVER_ERROR");
    }
};

export const rejectDocument = async (req, res) => {
    try {
        const docId = req.params.id;

        const [result] = await db.promise().query(
            `
            UPDATE DOCUMENT
            SET 
                IsValid = 0,
                IsReviewed = 1
            WHERE Doc_ID = ?
            `,
            [docId]
        );

        if (result.affectedRows === 0) {
            return sendError(res, 404, "Document not found", "NOT_FOUND");
        }

        return sendSuccess(res, "Document rejected successfully");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to reject document", "SERVER_ERROR");
    }
};

/* GET EVENTS */
export const getEvents = async (req, res) => {
    try {
        const [events] = await db.promise().query(`
            SELECT
                Event_ID,
                Name,
                StartDate,
                EndDate,
                Details,
                Entrance,
                Active_Flag
            FROM EVENT
            ORDER BY StartDate DESC
        `);

        return res.status(200).json({
            success: true,
            data: events
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch events"
        });
    }
};
export const createEvent = async (req, res) => {
    try {
        const { name, startDate, endDate, details, entrance } = req.body;

        const empId = 3;

        await db.promise().query(`
    INSERT INTO EVENT
    (Name, StartDate, EndDate, Details, Entrance, Emp_ID, Active_Flag)
    VALUES (?, ?, ?, ?, ?, ?, 1)
`, [
            name,
            startDate,
            endDate,
            details,
            entrance || 0,
            empId
        ]);

        res.status(201).json({
            success: true,
            message: "Event created successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to create event"
        });
    }
};
export const cancelEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.promise().query(`
            UPDATE EVENT
            SET Active_Flag = 0
            WHERE Event_ID = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return sendError(res, 404, "Event not found", "EVENT_NOT_FOUND");
        }

        return sendSuccess(res, "Event cancelled successfully");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to cancel event", "CANCEL_EVENT_ERROR");
    }
};
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, startDate, endDate, details, entrance } = req.body;

        console.log("UPDATE EVENT ID:", id);
        console.log("UPDATE BODY:", req.body);

        if (!id || isNaN(id)) {
            return sendError(res, 400, "Invalid event ID", "BAD_EVENT_ID");
        }

        if (!name || !startDate || !endDate) {
            return sendError(res, 400, "Missing required fields", "MISSING_FIELDS");
        }

        const [result] = await db.promise().query(
            `
            UPDATE EVENT
            SET
                Name = ?,
                StartDate = ?,
                EndDate = ?,
                Details = ?,
                Entrance = ?
            WHERE Event_ID = ?
            `,
            [
                name,
                startDate,
                endDate,
                details || "",
                Number(entrance) || 0,
                id
            ]
        );

        console.log("AFFECTED ROWS:", result.affectedRows);

        if (result.affectedRows === 0) {
            return sendError(res, 404, "Event not found or not updated", "EVENT_NOT_FOUND");
        }

        return sendSuccess(res, "Event updated successfully", {
            affectedRows: result.affectedRows
        });

    } catch (err) {
        console.error("UPDATE EVENT ERROR:", err);
        return sendError(res, 500, "Failed to update event", "UPDATE_EVENT_ERROR");
    }
};

/* GET ANNOUNCEMENTS */
export const getAnnouncements = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
    SELECT 
        Anc_ID,
        Name,
        Details,
        Emp_ID,
        Active_Flag,
        Created_Date
    FROM ANNOUNCEMENT
    ORDER BY Created_Date DESC
`);

        const formatted = rows.map(a => ({
            ...a,
            Active_Flag: a.Active_Flag ?? 1
        }));

        return res.status(200).json({
            success: true,
            data: formatted
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch announcements"
        });
    }
};

/* CREATE ANNOUNCEMENT */
export const createAnnouncement = async (req, res) => {
    try {
        const { name, details, createdDate } = req.body;

        const empId = req.user.empId || req.user.Emp_ID || 3;

        const finalDate = createdDate
            ? new Date(createdDate)
            : new Date();

        await db.promise().query(
            `
            INSERT INTO ANNOUNCEMENT
            (Name, Details, Emp_ID, Active_Flag, Created_Date)
            VALUES (?, ?, ?, 1, ?)
            `,
            [name, details, empId, finalDate]
        );

        return res.status(201).json({
            success: true,
            message: "Announcement created successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to create announcement"
        });
    }
};
/* UPDATE ANNOUNCEMENT */
export const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, details, createdDate } = req.body;

        const [result] = await db.promise().query(`
            UPDATE ANNOUNCEMENT
            SET 
                Name = ?,
                Details = ?,
                Created_Date = ?
            WHERE Anc_ID = ?
        `, [
            name,
            details || "",
            createdDate || new Date(),
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Announcement updated successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update announcement"
        });
    }
};
export const cancelAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.promise().query(`
            UPDATE ANNOUNCEMENT
            SET Active_Flag = 0
            WHERE Anc_ID = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Announcement cancelled successfully"
        });

    } catch (err) {
        console.error("CANCEL ANNOUNCEMENT ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to cancel announcement"
        });
    }
};