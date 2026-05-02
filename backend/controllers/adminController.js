import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

// GET CITIZENS BY STATUS ONLY
export const getUsersByStatus = async (req, res) => {
    const { status } = req.params;

    try {
        const [rows] = await db.promise().query(
            `
            SELECT
                u.U_ID,
                u.Username,
                u.Active_Flg,
                c.Email,
                CONCAT(c.First_Name, ' ', c.Last_Name) AS Citizen_Name
            FROM USERS u
            INNER JOIN CITIZEN c ON u.U_ID = c.U_ID
            WHERE u.Active_Flg = ?
            `,
            [status]
        );

        const users = rows.map(user => ({
            id: user.U_ID,
            name: user.Citizen_Name || user.Username,
            email: user.Email || "No Email",
            role: "Citizen",
            status:
                Number(status) === 0
                    ? "Pending"
                    : Number(status) === 1
                    ? "Approved"
                    : "Rejected"
        }));

        return sendSuccess(res, "Citizens fetched", users);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error", "SERVER_ERROR");
    }
};

// APPROVE USER
export const approveUser = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query(
            `
            UPDATE USERS
            SET Active_Flg = 1
            WHERE U_ID = ?
            `,
            [id]
        );

        return sendSuccess(res, "User approved");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error", "SERVER_ERROR");
    }
};

// REJECT USER
export const rejectUser = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query(
            `
            UPDATE USERS
            SET Active_Flg = 2
            WHERE U_ID = ?
            `,
            [id]
        );

        return sendSuccess(res, "User rejected");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error", "SERVER_ERROR");
    }
};

// GET ALL ROLES
export const getRoles = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `
            SELECT Role_ID, Role_Type
            FROM ROLES
            ORDER BY Role_ID
            `
        );

        return sendSuccess(res, "Roles fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error", "SERVER_ERROR");
    }
};

// GET EMPLOYEES
export const getEmployees = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `
            SELECT
                e.Emp_ID,
                e.U_ID,
                CONCAT(e.First_Name,' ',e.Last_Name) AS name,
                r.Role_Type,
                r.Role_ID
            FROM EMPLOYEE e
            LEFT JOIN ROLES r ON e.Role_ID = r.Role_ID
            `
        );

        return sendSuccess(res, "Employees fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error", "SERVER_ERROR");
    }
};

// ASSIGN ROLE
export const assignRole = async (req, res) => {
    const { empId, roleId } = req.body;

    try {
        await db.promise().query(
            `
            UPDATE EMPLOYEE
            SET Role_ID = ?
            WHERE Emp_ID = ?
            `,
            [roleId, empId]
        );

        return sendSuccess(res, "Role updated");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error", "SERVER_ERROR");
    }
};