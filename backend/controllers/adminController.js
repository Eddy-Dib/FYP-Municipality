import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { hashPassword } from "../utils/hash.js";
import { saveNotification, sendCitizenStatusEmail } from "../utils/notificationService.js";
import { generateUsername } from "../utils/generateUsername.js";

export const getCitizens = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT
                c.C_ID,
                c.First_Name,
                c.Last_Name,
                c.Email,
                c.Rejected,
                c.CreatedAt,
                u.U_ID,
                u.Username,
                u.Active_Flg
            FROM CITIZEN c
            LEFT JOIN USERS u ON c.U_ID = u.U_ID
            ORDER BY c.CreatedAt DESC
        `);

        const citizens = rows.map(c => {
            const isRegistered = c.U_ID !== null;

            return {
                id: c.C_ID,
                name: `${c.First_Name} ${c.Last_Name}`,
                email: c.Email,

                userId: c.U_ID || null,
                username: c.Username || null,

                isRegistered,
                isActive: c.Active_Flg === 1,
                rejected: c.Rejected === 1,

                status: c.Rejected === 1
                    ? "Rejected"
                    : !isRegistered
                        ? "Pending"
                        : c.Active_Flg === 1
                            ? "Active"
                            : "Disabled"
            };
        });

        return sendSuccess(res, "Citizens fetched", citizens);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

export const approveCitizen = async (req, res) => {
    const { id } = req.params;

    try {
        const [citizenRows] = await db.promise().query(
            `SELECT * FROM CITIZEN WHERE C_ID = ?`,
            [id]
        );

        if (citizenRows.length === 0) {
            return sendError(res, 404, "Citizen not found");
        }

        const citizen = citizenRows[0];

        if (citizen.Rejected === 1) {
            await db.promise().query(
                `UPDATE CITIZEN SET Rejected = 0 WHERE C_ID = ?`,
                [id]
            );

            await sendCitizenStatusEmail({
                email: citizen.Email,
                status: "reactivated",
                citizenName: citizen.First_Name
            });

            return sendSuccess(res, "Citizen reactivated");
        }

        if (citizen.U_ID) {
            return sendError(res, 400, "Already registered");
        }

        const username = await generateUsername( citizen.First_Name, citizen.Last_Name);

        const rawPassword = "1234";
        const hashedPassword = await hashPassword(rawPassword);

        const [userResult] = await db.promise().query(
            `INSERT INTO USERS (Username, Password, RegDate, Active_Flg)
             VALUES (?, ?, NOW(), 1)`,
            [username, hashedPassword]
        );

        const userId = userResult.insertId;

        await db.promise().query(
            `UPDATE CITIZEN SET U_ID = ? WHERE C_ID = ?`,
            [userId, id]
        );

        const email = citizen.Email;

        await sendCitizenStatusEmail({
            email,
            status: "approved",
            username,
            password: rawPassword,
            citizenName: citizen.First_Name
        });

        await saveNotification({
            title: "Account Approved",
            text: `Your account has been approved. Username: ${username}`,
            reqId: null,
            feeId: null
        });

        return sendSuccess(res, "Citizen approved and user created", {
            username,
            password: rawPassword
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

export const rejectCitizen = async (req, res) => {
    const { id } = req.params;

    try {
        const [citizenRows] = await db.promise().query(
            `SELECT * FROM CITIZEN WHERE C_ID = ?`,
            [id]
        );

        if (citizenRows.length === 0) {
            return sendError(res, 404, "Citizen not found");
        }

        const citizen = citizenRows[0];

        if (citizen.U_ID) {
            return sendError(res, 400, "Already processed");
        }

        if (citizen.Rejected === 1) {
            return sendError(res, 400, "Already rejected");
        }

        await db.promise().query(
            `UPDATE CITIZEN SET Rejected = 1 WHERE C_ID = ?`,
            [id]
        );

        await sendCitizenStatusEmail({
            email: citizen.Email,
            status: "rejected",
            citizenName: citizen.First_Name
        });

        await saveNotification({
            title: "Account Rejected",
            text: `Dear ${citizen.First_Name}, your registration was rejected.`,
            reqId: null,
            feeId: null
        });

        return sendSuccess(res, "Citizen rejected and notified");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

export const enableUser = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query(
            `UPDATE USERS SET Active_Flg = 1 WHERE U_ID = ?`,
            [id]
        );

        const [rows] = await db.promise().query(
            `SELECT c.Email, c.First_Name
             FROM CITIZEN c
             WHERE c.U_ID = ?`,
            [id]
        );

        const email = rows[0]?.Email;
        const name = rows[0]?.First_Name;

        await sendCitizenStatusEmail({
            email,
            status: "enabled",
            citizenName: name
        });

        return sendSuccess(res, "User enabled");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

export const disableUser = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query(
            `UPDATE USERS SET Active_Flg = 0 WHERE U_ID = ?`,
            [id]
        );

        const [rows] = await db.promise().query(
            `SELECT c.Email, c.First_Name
             FROM CITIZEN c
             WHERE c.U_ID = ?`,
            [id]
        );

        const email = rows[0]?.Email;
        const name = rows[0]?.First_Name;

        await sendCitizenStatusEmail({
            email,
            status: "disabled",
            citizenName: name
        });

        return sendSuccess(res, "User disabled");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

export const getRoles = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT Role_ID, Role_Type
            FROM ROLES
            ORDER BY Role_ID
        `);

        return sendSuccess(res, "Roles fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error", "SERVER_ERROR");
    }
};

export const getEmployees = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT
                e.Emp_ID,
                e.U_ID,
                CONCAT(e.First_Name, ' ', e.Last_Name) AS name,
                r.Role_ID,
                r.Role_Type,
                u.Active_Flg
            FROM EMPLOYEE e
            LEFT JOIN ROLES r ON e.Role_ID = r.Role_ID
            LEFT JOIN USERS u ON e.U_ID = u.U_ID
        `);

        return sendSuccess(res, "Employees fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

export const assignRole = async (req, res) => {
    const { empId, roleId } = req.body;

    if (!empId || !roleId) {
        return sendError(res, 400, "empId and roleId required");
    }

    try {
        const [empRows] = await db.promise().query(
            `SELECT U_ID FROM EMPLOYEE WHERE Emp_ID = ?`,
            [empId]
        );

        if (empRows.length === 0) {
            return sendError(res, 404, "Employee not found");
        }

        const userId = empRows[0].U_ID;

        
        if(Number(roleId) === -1){
            await db.promise().query(
                `UPDATE USERS u
                 JOIN EMPLOYEE e ON e.U_ID = u.U_ID
                 SET u.Active_Flg = 0
                 WHERE e.Emp_ID = ?`,
                [empId]
            );

            return sendSuccess(res, "Employee disabled");
        }

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

        await db.promise().query(
            `UPDATE USERS SET Active_Flg = 1 WHERE U_ID = ?`,
            [userId]
        );

        return sendSuccess(res, "Role assigned");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};

export const createEmployee = async (req, res) => {
    const { firstName, lastName, birthDate, roleId } = req.body;

    try {
        if (!firstName || !lastName || !birthDate || !roleId) {
            return sendError(res, 400, "Missing required fields");
        }

        const rawPassword = "1234";
        const hashedPassword = await hashPassword(rawPassword);

        const username = await generateUsername(firstName, lastName);

        const [userResult] = await db.promise().query(
            `INSERT INTO USERS (Username, Password, RegDate, Active_Flg)
             VALUES (?, ?, NOW(), 1)`,
            [username, hashedPassword]
        );

        const userId = userResult.insertId;

        const [empResult] = await db.promise().query(
            `INSERT INTO EMPLOYEE (First_Name, Last_Name, BirthDate, Role_ID, U_ID)
             VALUES (?, ?, ?, ?, ?)`,
            [firstName, lastName, birthDate, roleId, userId]
        );

        const empId = empResult.insertId;

        return sendSuccess(res, "Employee created successfully", {
            empId,
            username,
            password: rawPassword
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};