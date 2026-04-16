import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const getDashboard = async (req, res) => {

    const empId = req.user?.id;

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
        const [taskStatsRows] = await db.promise().query(
            `SELECT
                COUNT(*) AS assignedTasks,

                COUNT(CASE 
                    WHEN s.TStat_Name != 'Done' 
                    THEN 1 
                END) AS pendingTasks,

                COUNT(CASE 
                    WHEN t.Priority >= 2 
                    THEN 1 
                END) AS highPriorityTasks,

                COUNT(CASE 
                    WHEN t.DateCompleted IS NULL 
                    AND DATE_ADD(t.DateAssigned, INTERVAL rt.RType_Duration DAY) < NOW()
                    THEN 1 
                END) AS overdueTasks

            FROM TASK t
            JOIN TASK_STATUSES s ON t.TStat_Code = s.TStat_Code
            JOIN REQUEST r ON t.Req_ID = r.Req_ID
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            WHERE t.Emp_ID = ?`,
            [empId]
        );

        if (!taskStatsRows || taskStatsRows.length === 0) {
            return sendError(
                res,
                404,
                "No task statistics found",
                "TASK_STATS_NOT_FOUND"
            );
        }

        const [reportRows] = await db.promise().query(
            `SELECT COUNT(*) AS reports
            FROM REPORT r
            JOIN TASK t ON r.Task_ID = t.Task_ID
            WHERE t.Emp_ID = ?`,
            [empId]
        );

        if (!reportRows || reportRows.length === 0) {
            return sendError(
                res,
                404,
                "Report data not found",
                "REPORTS_NOT_FOUND"
            );
        }

        const [tasks] = await db.promise().query(
            `SELECT
                t.Task_ID,
                t.Name,
                t.Priority,
                t.DateAssigned,
                s.TStat_Name AS Status,
                r.Req_ID,
                rt.RType_ID,
                rt.RType_Duration,
                CONCAT(
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(t.Task_ID, 3, '0')
                ) AS TaskNumber,
                CONCAT(
                    'REQ-',
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(rt.RType_ID, 2, '0'),
                    LPAD(r.Req_ID, 3, '0')
                ) AS RequestNumber

            FROM TASK t
            JOIN TASK_STATUSES s ON t.TStat_Code = s.TStat_Code
            JOIN REQUEST r ON t.Req_ID = r.Req_ID
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID

            WHERE t.Emp_ID = ?
            AND s.TStat_Name != 'Done'

            ORDER BY t.DateAssigned DESC;`,
            [empId]
        );

        if (!tasks || tasks.length === 0) {
            return sendError(
                res,
                404,
                "Tasks not found",
                "TASKS_NOT_FOUND"
            );
        }

        const taskStats = taskStatsRows[0];
        const reports = reportRows[0];

        const formattedTasks = tasks.map(task => {

            const dueDate = new Date(task.DateAssigned);
            dueDate.setDate(dueDate.getDate() + task.RType_Duration);

            return {
                id: task.Task_ID,
                number: task.TaskNumber,
                name: task.Name,
                status: task.Status,
                priority:
                    task.Priority >= 2 ? "High" :
                        task.Priority === 1 ? "Medium" : "Low",

                requestId: task.RequestNumber,

                dueDate: dueDate.toISOString().split("T")[0]
            };
        });

        return sendSuccess(res, "Dashboard loaded", {
            summary: {
                assignedTasks: taskStats.assignedTasks,
                pendingTasks: taskStats.pendingTasks,
                highPriorityTasks: taskStats.highPriorityTasks,
                overdueTasks: taskStats.overdueTasks,
                reports: reports.reports
            },
            recentTasks: formattedTasks
        });

    } catch (err) {
        return sendError(
            res,
            500,
            "Failed to load dashboard",
            "DASHBOARD_SERVER_ERROR"
        );
    }
};