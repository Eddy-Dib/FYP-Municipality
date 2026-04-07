import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const login = async (req, res) => {
    let { username, password } = req.body;

    if (typeof username === "string") username = username.trim().toLowerCase();

    if (!username || !password || typeof username !== "string" || typeof password !== "string" || username === "" || password === "") {
        return sendError(res, 400, "Please enter a username and password.", "BAD_REQUEST");
    }

    try {
        const [rows] = await db.promise().query(
            `SELECT 
                u.U_ID, u.Username, u.Password, u.Active_Flg, e.Emp_ID, r.Role_ID, r.Role_Type, c.C_ID
            FROM USERS u
            LEFT JOIN EMPLOYEE e ON u.U_ID = e.U_ID
            LEFT JOIN ROLES r ON e.Role_ID = r.Role_ID
            LEFT JOIN CITIZEN c ON u.U_ID = c.U_ID
            WHERE LOWER(u.Username) = ?`,
            [username]
        );

        if (rows.length === 0) {
            return sendError(res, 401, "Wrong username or password.", "INVALID_CREDENTIALS");
        }

        const user = rows[0];

        if (user.Active_Flg === 0) {
            return sendError(res, 403, "Access denied. Please contact an administrator or use a different account.", "ACCESS_DENIED");
        }

        // TODO: add hashing
        if (user.Password !== password) {
            return sendError(res, 401, "Wrong username or password.", "INVALID_CREDENTIALS");
        }

        let role = null;
        if (user.Emp_ID) role = user.Role_Type;
        else if (user.C_ID) role = "citizen";
        else return sendError(res, 403, "Access denied. Please contact an administrator or use a different account.", "ACCESS_DENIED");

        return sendSuccess(res, "Login successful", {
            user: { id: user.U_ID, username: user.Username, role }
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error. Try again later.", "SERVER_ERROR");
    }
};