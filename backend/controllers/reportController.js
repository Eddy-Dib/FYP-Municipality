import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { formatDate } from "../utils/formats.js";

export const getReportByTask = async (req, res) => {
    const empId = req.user?.id;
    const taskId = req.params.id;

    if (!req.user?.isEmployee) {
        return sendError(res, 403, "Employees only", "NOT_EMPLOYEE");
    }

    if (!taskId || isNaN(taskId)) {
        return sendError(res, 400, "Invalid task id", "BAD_TASK_ID");
    }

    try {
        const [taskRows] = await db.promise().query(
            `SELECT Task_ID FROM TASK WHERE Task_ID = ? AND Emp_ID = ?`,
            [taskId, empId]
        );

        if (!taskRows.length) {
            return sendError(res, 404, "Task not found", "TASK_NOT_FOUND");
        }

        const [rows] = await db.promise().query(
            `SELECT 
                Report_ID AS reportId,
                Title AS title,
                Description AS description,
                RepType_ID AS typeId,
                Task_ID AS taskId
             FROM REPORT
             WHERE Task_ID = ?`,
            [taskId]
        );

        const report = rows.length ? rows[0] : null;

        return sendSuccess(res, "Report fetched", {
            report
        });

    } catch (err) {
        console.error("GET REPORT ERROR:", err);
        return sendError(res, 500, "Failed to load report", "REPORT_SERVER_ERROR");
    }
};



export const updateReport = async (req, res) => {
    const empId = req.user?.id;
    const taskId = req.params.taskId;
    const { title, description, type } = req.body;

    if (!req.user?.isEmployee) {
        return sendError(res, 403, "Employees only", "NOT_EMPLOYEE");
    }

    if (!taskId || isNaN(taskId)) {
        return sendError(res, 400, "Invalid task id", "BAD_TASK_ID");
    }

    if (!title || !description || !type) {
        return sendError(res, 400, "Missing report fields", "MISSING_FIELDS");
    }

    try {
        const [taskRows] = await db.promise().query(
            `SELECT Task_ID FROM TASK WHERE Task_ID = ? AND Emp_ID = ?`,
            [taskId, empId]
        );

        if (!taskRows.length) {
            return sendError(res, 404, "Task not found", "TASK_NOT_FOUND");
        }

        const [typeRows] = await db.promise().query(
            `SELECT RepType_ID FROM REP_TYPE WHERE RepType_Name = ?`,
            [type]
        );

        if (!typeRows.length) {
            return sendError(res, 400, "Invalid report type", "INVALID_TYPE");
        }

        const repTypeId = typeRows[0].RepType_ID;

        const [existing] = await db.promise().query(
            `SELECT Report_ID FROM REPORT WHERE Task_ID = ?`,
            [taskId]
        );

        if (existing.length > 0) {
            await db.promise().query(
                `UPDATE REPORT 
                 SET Title = ?, Description = ?, RepType_ID = ?
                 WHERE Task_ID = ?`,
                [title, description, repTypeId, taskId]
            );

            return sendSuccess(res, "Report updated successfully", {
                taskId
            });
        }

        await db.promise().query(
            `INSERT INTO REPORT (Title, Description, RepType_ID, Task_ID)
             VALUES (?, ?, ?, ?)`,
            [title, description, repTypeId, taskId]
        );

        return sendSuccess(res, "Report created successfully", {
            taskId
        });

    } catch (err) {
        console.error("UPSERT REPORT ERROR:", err);
        return sendError(res, 500, "Failed to save report", "REPORT_SAVE_ERROR");
    }
};


export const getReportHistory = async (req, res) => {
    const empId = req.user?.id;

    if (!req.user || !req.user.isEmployee) {
        return sendError(res, 403, "Employees only");
    }

    if (!empId) {
        return sendError(res, 401, "Invalid user session");
    }

    try {
        const [rows] = await db.promise().query(
            `SELECT 
                t.Task_ID,
                t.Name AS TaskName,
                t.DateCompleted,
                ts.TStat_Name AS TaskStatus,

                rep.Report_ID,
                rep.Title,
                rep.Description,
                rpt.RepType_Name,

                rt.RType_Name AS RequestType,
                CONCAT(c.First_Name, ' ', c.Last_Name) AS Full_Name,

                CONCAT(
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(t.Task_ID, 3, '0')
                ) AS TaskNumber,

                CONCAT(
                    'REQ-',
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(r.Req_ID, 3, '0')
                ) AS RequestNumber

            FROM TASK t
            JOIN TASK_STATUSES ts ON t.TStat_Code = ts.TStat_Code
            JOIN REQUEST r ON t.Req_ID = r.Req_ID
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            JOIN REPORT rep ON rep.Task_ID = t.Task_ID
            JOIN REP_TYPE rpt ON rep.RepType_ID = rpt.RepType_ID
            JOIN CITIZEN c ON r.C_ID = c.C_ID

            WHERE t.Emp_ID = ?
              AND ts.TStat_Name = 'Completed'
              AND rep.Report_ID IS NOT NULL

            ORDER BY t.DateCompleted DESC`,
            [empId]
        );

        const formatted = rows.map(row => ({
            reportId: row.Report_ID,
            title: row.Title,
            description: row.Description,
            type: row.RepType_Name,
            taskNumber: row.TaskNumber,
            taskName: row.TaskName,
            requestNumber: row.RequestNumber,
            requestType: row.RequestType,
            status: row.TaskStatus,
            citizenName: row.Full_Name,
            completedDate: formatDate(row.DateCompleted)
        }));

        return sendSuccess(res, "Report history loaded", formatted);

    } catch (err) {
        console.error("GET REPORT HISTORY ERROR:", err);

        return sendError(res, 500, "Failed to load report history", "REPORT_HISTORY_ERROR");
    }
};


export const getReportById = async (req, res) => {
    const empId = req.user?.id;
    const reportId = req.params.id;

    if (!req.user || !req.user.isEmployee) {
        return sendError(res, 403, "Employees only");
    }

    if (!empId) {
        return sendError(res, 401, "Invalid user session");
    }

    try {
        const [rows] = await db.promise().query(
            `SELECT 
                t.Task_ID,
                t.Name AS TaskName,
                t.DateCompleted,
                ts.TStat_Name AS TaskStatus,

                rep.Report_ID,
                rep.Title,
                rep.Description,
                rpt.RepType_Name,

                rt.RType_Name AS RequestType,

                CONCAT(
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(t.Task_ID, 3, '0')
                ) AS TaskNumber,

                CONCAT(
                    'REQ-',
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(r.Req_ID, 3, '0')
                ) AS RequestNumber

            FROM REPORT rep
            JOIN TASK t ON rep.Task_ID = t.Task_ID
            JOIN TASK_STATUSES ts ON t.TStat_Code = ts.TStat_Code
            JOIN REQUEST r ON t.Req_ID = r.Req_ID
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            JOIN REP_TYPE rpt ON rep.RepType_ID = rpt.RepType_ID

            WHERE rep.Report_ID = ?
              AND t.Emp_ID = ?`,
            [reportId, empId]
        );

        if (!rows.length) {
            return sendError(res, 404, "Report not found");
        }

        const row = rows[0];

        const formatted = {
            reportId: row.Report_ID,
            title: row.Title,
            description: row.Description,
            type: row.RepType_Name,
            taskNumber: row.TaskNumber,
            taskName: row.TaskName,
            requestNumber: row.RequestNumber,
            requestType: row.RequestType,
            status: row.TaskStatus,
            completedDate: formatDate(row.DateCompleted)
        };

        return sendSuccess(res, "Report loaded", formatted);

    } catch (err) {
        console.error("GET REPORT BY ID ERROR:", err);
        return sendError(res, 500, "Failed to load report");
    }
};