import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

// GET CITIZENS BY STATUS ONLY
export const getCitizens = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT
                c.C_ID,
                c.First_Name,
                c.Last_Name,
                c.Email,
                u.U_ID,
                u.Username,
                u.Active_Flg
            FROM CITIZEN c
            LEFT JOIN USERS u ON c.U_ID = u.U_ID
        `);

        const citizens = rows.map(c => ({
            id: c.C_ID,
            name: `${c.First_Name} ${c.Last_Name}`,
            email: c.Email,
            username: c.Username || null,
            status:
                c.U_ID === null
                    ? "Not Registered"
                    : c.Active_Flg === 1
                        ? "Active"
                        : "Disabled"
        }));

        return sendSuccess(res, "Citizens fetched", citizens);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

// APPROVE USER
export const enableUser = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query(
            `UPDATE USERS SET Active_Flg = 1 WHERE U_ID = ?`,
            [id]
        );

        return sendSuccess(res, "User enabled");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

// REJECT USER
export const disableUser = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query(
            `UPDATE USERS SET Active_Flg = 0 WHERE U_ID = ?`,
            [id]
        );

        return sendSuccess(res, "User disabled");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
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
        const [rows] = await db.promise().query(`
            SELECT
                e.Emp_ID,
                e.U_ID,
                CONCAT(e.First_Name, ' ', e.Last_Name) AS name,
                r.Role_ID,
                r.Role_Type
            FROM EMPLOYEE e
            LEFT JOIN ROLES r ON e.Role_ID = r.Role_ID
        `);

        return sendSuccess(res, "Employees fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

// ASSIGN ROLE
export const assignRole = async (req, res) => {
    const { empId, roleId } = req.body;

    if (!empId || !roleId) {
        return sendError(res, 400, "empId and roleId required");
    }

    try {
        const [role] = await db.promise().query(
            `SELECT Role_ID FROM ROLES WHERE Role_ID = ?`,
            [roleId]
        );

        if (role.length === 0) {
            return sendError(res, 404, "Role not found");
        }

        await db.promise().query(
            `UPDATE EMPLOYEE SET Role_ID = ? WHERE Emp_ID = ?`,
            [roleId, empId]
        );

        return sendSuccess(res, "Role assigned");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};