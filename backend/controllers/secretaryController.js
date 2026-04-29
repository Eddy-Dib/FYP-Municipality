import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { formatDate, safeParseJSON } from "../utils/formats.js";
import { getPriority } from "../utils/labels.js";

const requireSecretary = (req, res) => {
    if (!req.user) {
        sendError(res, 401, "Unauthorized access", "NO_USER_CONTEXT");
        return false;
    }

    if (!req.user.isEmployee) {
        sendError(res, 403, "Access denied: employees only", "NOT_EMPLOYEE");
        return false;
    }

    if (req.user.role !== "Secretary") {
        sendError(res, 403, "Access denied: secretary only", "NOT_SECRETARY");
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
            WHERE r.RStat_Code IN (1,2,4)
        `);

        const formatted = rows.map(r => ({
            id: r.Req_ID,
            requestNumber: r.RequestNumber,
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
                d.IsValid
            FROM REQUEST r
            JOIN CITIZEN c ON r.C_ID = c.C_ID
            JOIN DOCUMENT d ON d.C_ID = c.C_ID
            WHERE r.Req_ID = ?
            ORDER BY d.DateUploaded DESC
        `, [id]);

        const formatted = rows.map(d => ({
            id: d.Doc_ID,
            type: d.Doc_Type,
            uploadedAt: d.DateUploaded ? formatDate(new Date(d.DateUploaded)) : null,
            filePath: d.FilePath,
            isValid: Number(d.IsValid) === 1,
            status: Number(d.IsValid) === 1 ? "Valid" : "Invalid"
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
                rt.RType_Name
            FROM REQUEST r
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
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

        return sendSuccess(res, "Request approved and task created");

    } catch (err) {
        await connection.rollback();
        console.error("APPROVE ERROR:", err);
        return sendError(res, 500, "Failed to approve request", "APPROVE_ERROR");
    } finally {
        connection.release();
    }
};