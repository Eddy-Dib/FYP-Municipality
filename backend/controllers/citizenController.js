import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { saveCitizenDocument } from "../utils/documentHandler.js";
import {verifyPassword, hashPassword} from "../utils/hash.js"

export const getMyProfile = (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 401, "Unauthorized", "NO_USER");
        }

        const query = `
            SELECT 
                CONCAT(c.First_Name, ' ', c.Last_Name) AS FullName,
                c.Email,
                c.Phone_Num,
                ci.City_ID,
                s.Street_ID,
                b.Building_ID,
                l.Location_ID,
                CONCAT(
                    ci.City_Name, ' - ',
                    s.Street_Name, ' - ',
                    b.Building_Name, ' - floor ',
                    l.Floor
                ) AS Address
            FROM CITIZEN c
            LEFT JOIN LOCATION l ON c.Location_ID = l.Location_ID
            LEFT JOIN BUILDING b ON l.Building_ID = b.Building_ID
            LEFT JOIN STREET s ON b.Street_ID = s.Street_ID
            LEFT JOIN CITY ci ON s.City_ID = ci.City_ID
            WHERE c.U_ID = ?
        `;

        db.query(query, [userId], (err, results) => {
            if (err) return sendError(res, 500, "Database error", err.message);
            if (!results.length) return sendError(res, 404, "Citizen not found", "NO_CITIZEN");

            return sendSuccess(res, "Profile fetched", results[0]);
        });

    } catch (err) {
        return sendError(res, 500, "Server error", err.message);
    }
};
export const changePassword = async (req, res) => {

    try {

        const userId = req.user?.id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!userId) {
            return sendError(res, 401, "Unauthorized");
        }

        if (!currentPassword || !newPassword) {
            return sendError(res, 400, "Missing password fields");
        }

        const [users] = await db.promise().query(
            `
            SELECT Password
            FROM USERS
            WHERE U_ID = ?
            `,
            [userId]
        );

        if (users.length === 0) {
            return sendError(res, 404, "User not found");
        }

        const user = users[0];

        const isMatch = await verifyPassword(currentPassword, user.Password);

        if (!isMatch) {
            return sendError(res, 400, "Current password is incorrect");
        }

        const hashedPassword = await hashPassword(newPassword);

        await db.promise().query(
            `
            UPDATE USERS
            SET Password = ?
            WHERE U_ID = ?
            `,
            [hashedPassword, userId]
        );

        return sendSuccess(res, "Password updated successfully");

    } catch (err) {
        console.log(err);
        return sendError(res, 500, "Server error");
    }
};

export const registerCitizen = async (req, res) => {
    const {
        firstName,
        lastName,
        birthDate,
        email,
        phone,
        locationId,
        docType
    } = req.body;

    const file = req.file;

    if (
        !firstName ||
        !lastName ||
        !birthDate ||
        !email ||
        !locationId
    ) {
        return sendError(res, 400, "Missing required fields");
    }

    if (!file) {
        return sendError(res, 400, "Document file is required");
    }

    try {
        const [locationCheck] = await db.promise().query(
            `SELECT Location_ID FROM LOCATION WHERE Location_ID = ?`,
            [locationId]
        );

        if (locationCheck.length === 0) {
            return sendError(res, 400, "Invalid location selected", "INVALID_LOCATION");
        }

        const [citizenResult] = await db.promise().query(
            `INSERT INTO CITIZEN 
            (First_Name, Last_Name, BirthDate, Email, Phone_Num, Location_ID, U_ID)
            VALUES (?, ?, ?, ?, ?, ?, NULL)`,
            [firstName, lastName, birthDate, email, phone || null, locationId]
        );

        const citizenId = citizenResult.insertId;

        const savedFilePath = await saveCitizenDocument({
            file,
            firstName,
            lastName,
            citizenId,
            docType: docType || 1
        });

        await db.promise().query(
            `INSERT INTO DOCUMENT
            (DateUploaded, Description, FilePath, C_ID, Doc_Type, IsValid)
            VALUES (NOW(), ?, ?, ?, ?, 1)`,
            [
                "Citizen registration document",
                savedFilePath,
                citizenId,
                docType || 1
            ]
        );

        return sendSuccess(res, "Citizen registration submitted successfully", {
            citizenId
        });

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Server error");
    }
};