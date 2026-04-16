import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const getDashboard = async (req, res) => {

    const empId = req.user.id;

    try {
        const [taskStatsRows] = db.promise().query(
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

        const [reportRows] = db.promise().query(
            `SELECT COUNT(*) AS reports
            FROM REPORT r
            JOIN TASK t ON r.Task_ID = t.Task_ID
            WHERE t.Emp_ID = ?`,
            [empId]
        );

        const [tasks] = db.promise().query(
            `SELECT 
                t.Task_ID,
                t.Name,
                t.Priority,
                t.DateAssigned,
                s.TStat_Name AS Status,
                r.Req_ID,
                rt.RType_Duration,

                CASE 
                    WHEN t.DateAssigned >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                    THEN 1 ELSE 0
                END AS IsRecentWindow

            FROM TASK t
            JOIN TASK_STATUSES s ON t.TStat_Code = s.TStat_Code
            JOIN REQUEST r ON t.Req_ID = r.Req_ID
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID

            WHERE t.Emp_ID = ?
            AND s.TStat_Name != 'Done'

            ORDER BY 
                IsRecentWindow DESC,
                t.DateAssigned DESC

            LIMIT 10`,
            [empId]
        );

        const taskStats = taskStatsRows[0];
        const reports = reportRows[0];

        const formattedTasks = tasks.map(task => {

            const dueDate = new Date(task.DateAssigned);
            dueDate.setDate(dueDate.getDate() + task.RType_Duration);

            return {
                id: task.Task_ID,
                name: task.Name,
                status: task.Status,
                priority:
                    task.Priority >= 2 ? "High" :
                        task.Priority === 1 ? "Medium" : "Low",
                requestId: `REQ-${task.Req_ID}`,
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
            err.message
        );
    }
};