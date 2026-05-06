import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { getPriority } from "../utils/labels.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { formatRequestNumber } from "../utils/formats.js";

export const getDashboard = async (req, res) => {

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
        const [taskStatsRows] = await db.promise().query(
            `SELECT
                COUNT(*) AS assignedTasks,

                COUNT(CASE 
                    WHEN t.TStat_Code IN (1,2,3,4) 
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
            JOIN REQUEST r ON t.Req_ID = r.Req_ID
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID
            WHERE t.Emp_ID = ?`,
            [empId]
        );

        const taskStats = taskStatsRows[0];

        const [reportRows] = await db.promise().query(
            `SELECT COUNT(*) AS reports
             FROM REPORT r
             JOIN TASK t ON r.Task_ID = t.Task_ID
             WHERE t.Emp_ID = ?`,
            [empId]
        );

        const reports = reportRows[0];

        const [tasks] = await db.promise().query(
            `SELECT
                t.Task_ID,
                t.Name,
                t.Priority,
                t.DateAssigned,
                t.DateCompleted,
                t.TStat_Code,
                s.TStat_Name AS Status,

                r.Req_ID,
                rt.RType_ID,
                rt.RType_Duration,

                CONCAT(
                    DATE_FORMAT(t.DateAssigned, '%y'),
                    LPAD(t.Task_ID, 3, '0')
                ) AS TaskNumber

            FROM TASK t
            JOIN TASK_STATUSES s ON t.TStat_Code = s.TStat_Code
            JOIN REQUEST r ON t.Req_ID = r.Req_ID
            JOIN REQUEST_TYPES rt ON r.RType_ID = rt.RType_ID

            WHERE t.Emp_ID = ?
            AND t.TStat_Code != 5

            ORDER BY t.DateAssigned DESC`,
            [empId]
        );

        const formattedTasks = tasks.map(task => {
            const dueDate = new Date(task.DateAssigned);
            dueDate.setDate(dueDate.getDate() + task.RType_Duration);

            return {
                id: task.Task_ID,
                number: task.TaskNumber,
                name: task.Name,
                status: task.Status,
                priority: getPriority(task.Priority),

                requestId: task.Req_id,
                requestNum: formatRequestNumber({
                    date: task.DateAssigned,
                    requestTypeId: task.RType_ID,
                    requestId: task.Req_ID
                }),

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
        console.error("DASHBOARD ERROR:", err);
        return sendError(
            res,
            500,
            "Failed to load dashboard",
            "DASHBOARD_SERVER_ERROR"
        );
    }
};

export const changeEmpPassword = async (req, res) => {
    const empId = req.user?.empId;

    const { currentPassword, newPassword } = req.body;

    if (!req.user || !req.user.isEmployee) {
        return sendError(res, 403, "Employees only", "NOT_EMPLOYEE");
    }

    if (!empId) {
        return sendError(res, 401, "Invalid session", "INVALID_USER_ID");
    }

    if (!currentPassword || !newPassword) {
        return sendError(res, 400, "Missing password fields");
    }

    try {
        const [rows] = await db.promise().query(
            `SELECT u.U_ID, u.Password
             FROM EMPLOYEE e
             JOIN USERS u ON e.U_ID = u.U_ID
             WHERE e.Emp_ID = ?`,
            [empId]
        );

        if (rows.length === 0) {
            return sendError(res, 404, "User not found");
        }

        const user = rows[0];

        const isValid = await verifyPassword(
            currentPassword,
            user.Password
        );

        if (!isValid) {
            return sendError(res, 400, "Current password is incorrect");
        }

        const hashedPassword = await hashPassword(newPassword);

        await db.promise().query(
            `UPDATE USERS SET Password = ? WHERE U_ID = ?`,
            [hashedPassword, user.U_ID]
        );

        return sendSuccess(res, "Password updated successfully");

    } catch(err){
        console.error("CHANGE PASSWORD ERROR:", err);
        return sendError(res, 500, "Server error", "CHANGE_PASSWORD_FAILED");
    }
};

export const getEmpProfile = async (req, res) => {
    const empId = req.user?.empId;

    if (!req.user || !req.user.isEmployee) {
        return sendError(res, 403, "Employees only", "NOT_EMPLOYEE");
    }

    if (!empId) {
        return sendError(res, 401, "Invalid session", "INVALID_USER_ID");
    }

    try {
        const [rows] = await db.promise().query(
            `SELECT 
                e.Emp_ID,
                e.First_Name,
                e.Last_Name,
                r.Role_Type,
                u.Username,
                u.Active_Flg
             FROM EMPLOYEE e
             JOIN USERS u ON e.U_ID = u.U_ID
             LEFT JOIN ROLES r ON e.Role_ID = r.Role_ID
             WHERE e.Emp_ID = ?`,
            [empId]
        );

        if (rows.length === 0) {
            return sendError(res, 404, "Employee not found");
        }

        const emp = rows[0];

        return sendSuccess(res, "Profile fetched", {
            Emp_ID: emp.Emp_ID,
            name: `${emp.First_Name} ${emp.Last_Name}`,
            Role_Type: emp.Role_Type,
            Username: emp.Username,
            isActive: emp.Active_Flg === 1
        });

    } catch (err) {
        console.error("PROFILE ERROR:", err);
        return sendError(res, 500, "Server error", "PROFILE_FAILED");
    }
};