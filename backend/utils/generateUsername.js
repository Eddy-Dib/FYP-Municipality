import db from "../config/db.js";

export const generateUsername = async (first, last) => {
    const base = `${first.toLowerCase()}.${last.toLowerCase()}`;

    const [rows] = await db.promise().query(
        `SELECT COUNT(*) AS count
         FROM USERS
         WHERE Username LIKE ?`,
        [`${base}%`]
    );

    const count = rows[0].count;

    if (count === 0) return base;

    return `${base}.${count}`;
};