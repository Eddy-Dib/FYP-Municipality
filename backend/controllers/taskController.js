import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { formatDate } from "../utils/formats.js";

// returns task details
export const getTaskDetails = async (req, res) => {
    const empId = req.user?.id;
    const taskId = req.params.id;

    if (!req.user) {
        return sendError(res, 401, "Unauthorized access", "NO_USER_CONTEXT");
    }

    if (!req.user.isEmployee) {
        return sendError(res, 403, "Access denied: employees only", "NOT_EMPLOYEE");
    }

    if (!empId) {
        return sendError(res, 401, "Invalid user session", "INVALID_USER_ID");
    }

    if (!taskId || isNaN(taskId)) {
        return sendError(res, 400, "Invalid task id", "BAD_TASK_ID");
    }

    try {
        const [rows] = await db.promise().query(
            `SELECT
                t.Task_ID,
                t.Name AS TaskName,
                t.Priority,
                t.DateAssigned,
                t.DateCompleted,
                ts.TStat_Name AS TaskStatus,

                r.Req_ID,
                r.DateMade AS RequestDate,
                r.Description AS RequestDescription,
                r.FlagRejected,
                rs.RStat_Name AS RequestStatus,
                rt.RType_Name,
                rt.RType_Duration,
                rpt.RepType_Name AS ReportTypeName,

                CONCAT(
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(t.Task_ID, 3, '0')
                ) AS TaskNumber,

                CONCAT(
                    'REQ-',
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(rt.RType_ID, 2, '0'),
                    LPAD(r.Req_ID, 3, '0')
                ) AS RequestNumber,

                CONCAT(c.First_Name, ' ', c.Last_Name) AS CitizenName,
                c.Email,
                c.Phone_Num,

                CONCAT(
                    city.City_Name, ' - ',
                    s.Street_Name, ' - ',
                    b.Building_Name, ' - floor ',
                    l.Floor
                ) AS Address,

                rep.Report_ID AS Report_ID,
                rep.Title AS ReportTitle,
                rep.Description AS ReportDescription,
                rep.RepType_ID

            FROM TASK t
            JOIN TASK_STATUSES ts ON t.TStat_Code = ts.TStat_Code
            JOIN REQUEST r ON t.Req_ID = r.Req_ID
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            JOIN REQ_STATUSES rs ON r.RStat_Code = rs.RStat_Code
            JOIN CITIZEN c ON r.C_ID = c.C_ID

            LEFT JOIN LOCATION l ON c.Location_ID = l.Location_ID
            LEFT JOIN LOCATION_TYPE lt ON l.LocT_ID = lt.LocT_ID
            LEFT JOIN BUILDING b ON l.Building_ID = b.Building_ID
            LEFT JOIN STREET s ON b.Street_ID = s.Street_ID
            LEFT JOIN CITY city ON s.City_ID = city.City_ID

            LEFT JOIN REPORT rep ON rep.Task_ID = t.Task_ID
            LEFT JOIN REP_TYPE rpt on rep.RepType_ID = rpt.RepType_ID

            WHERE t.Task_ID = ?
            AND t.Emp_ID = ?`,
            [taskId, empId]
        );

        if (!rows || rows.length === 0) {
            return sendError(res, 404, "Task not found", "TASK_NOT_FOUND");
        }

        const data = rows[0];

        if (data.FlagRejected === 1) {
            return sendError(
                res,
                403,
                "This task is linked to a rejected request",
                "REJECTED_REQUEST"
            );
        }

        const duration = data.RType_Duration || 0;

        const dueDate = new Date(data.DateAssigned);
        dueDate.setDate(dueDate.getDate() + duration);

        let requestDescription = data.RequestDescription;

        if (typeof requestDescription === "object" && requestDescription !== null) {
            requestDescription = Object.entries(requestDescription)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ");
        }

        return sendSuccess(res, "Task details loaded", {
            task: {
                id: data.Task_ID,
                taskNumber: data.TaskNumber,
                name: data.TaskName,
                status: data.TaskStatus,
                priority:
                    data.Priority >= 2
                        ? "High"
                        : data.Priority === 1
                            ? "Medium"
                            : "Low",
                assignedDate: formatDate(data.DateAssigned),
                completedDate: formatDate(data.DateCompleted),
                dueDate: formatDate(dueDate)
            },

            request: {
                id: data.Req_ID,
                requestNumber: data.RequestNumber,
                type: data.RType_Name,
                description: requestDescription,
                status: data.RequestStatus,
                dueDate: formatDate(dueDate)
            },

            citizen: {
                id: data.C_ID,
                name: data.CitizenName,
                email: data.Email,
                phone: data.Phone_Num
            },

            location: {
                address: data.Address
            },

            report: data.Report_ID
                ? {
                    reportID: data.Report_ID,
                    title: data.ReportTitle,
                    description: data.ReportDescription,
                    type: data.ReportTypeName
                }
                : null
        });

    } catch (err) {
        console.error("TASK DETAILS ERROR:", err);
        return sendError(res, 500, "Failed to load task", "TASK_SERVER_ERROR");
    }
};


// updates task status in database
export const updateTaskStatus = async (req, res) => {
    const empId = req.user?.id;
    const taskId = req.params.id;
    const { status } = req.body;

    if (!req.user) {
        return sendError(res, 401, "Unauthorized", "NO_USER_CONTEXT");
    }

    if (!req.user.isEmployee) {
        return sendError(res, 403, "Employees only", "NOT_EMPLOYEE");
    }

    if (!taskId || isNaN(taskId)) {
        return sendError(res, 400, "Invalid task id", "BAD_TASK_ID");
    }

    if (!status) {
        return sendError(res, 400, "Status is required", "MISSING_STATUS");
    }

    try {
        const statusMap = {
            "Pending": 1,
            "In Progress": 2,
            "Escalated": 3,
            "On Hold": 4,
            "Completed": 5,
            "Rejected": 6,
            "Cancelled": 7
        };

        const statusCode = statusMap[status];

        if (!statusCode) {
            return sendError(res, 400, "Invalid status value", "INVALID_STATUS");
        }

        // makes sure the employee is assigned to the task first
        const [taskRows] = await db.promise().query(
            `SELECT Task_ID FROM TASK WHERE Task_ID = ? AND Emp_ID = ?`,
            [taskId, empId]
        );

        if (!taskRows.length) {
            return sendError(res, 404, "Task not found", "TASK_NOT_FOUND");
        }

        await db.promise().query(
            `UPDATE TASK SET TStat_Code = ? WHERE Task_ID = ?`,
            [statusCode, taskId]
        );

        if (status === "Completed") {
            await db.promise().query(
                `UPDATE TASK SET DateCompleted = NOW() WHERE Task_ID = ?`,
                [taskId]
            );
        } else {
            await db.promise().query(
                `UPDATE TASK SET DateCompleted = NULL WHERE Task_ID = ?`,
                [taskId]
            );
        }

        return sendSuccess(res, "Task status updated", {
            taskId,
            status,
            statusCode
        });

    } catch (err) {
        console.error("UPDATE TASK STATUS ERROR:", err);
        return sendError(res, 500, "Failed to update task status", "TASK_UPDATE_ERROR");
    }
};