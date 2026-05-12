import db from "../config/db.js";

import {
    sendSuccess,
    sendError
} from "../utils/responses.js";

import { saveCitizenDocument } from "../utils/documentHandler.js";

export const getDocumentTypes = async (req, res) => {
    try {

        db.query(`
            SELECT *
            FROM DOC_TYPE
            ORDER BY Doc_Type_Name
        `, (err, rows) => {

            if (err) {
                console.log(err);

                return sendError(
                    res,
                    500,
                    "Failed to fetch document types",
                    "SERVER_ERROR"
                );
            }

            return sendSuccess(
                res,
                "Document types fetched successfully",
                rows
            );
        });

    } catch (err) {
        console.log(err);

        return sendError(
            res,
            500,
            "Failed to fetch document types",
            "SERVER_ERROR"
        );
    }
};

export const uploadDocuments = async (req, res) => {
    try {
        const userId = req.user?.id;

		if (!userId) {
			return sendError(res, 401, "Unauthorized", "NO_USER");
		}

		const [citizens] = await db.promise().query(
			`SELECT C_ID, First_Name, Last_Name
      		FROM CITIZEN
      		WHERE U_ID = ?`,
			[userId]
		);

		if (!citizens.length) {
			return sendError(res, 404, "Citizen profile not found", "CITIZEN_NOT_FOUND");
		}

		const citizenId = citizens[0].C_ID;
        const files = req.files;

        if (!files || files.length === 0) {
            return sendError(
                res,
                400,
                "No files uploaded",
                "NO_FILES"
            );
        }

        const uploadTasks = files.map((file, i) => {

            return new Promise((resolve, reject) => {

                const docType = req.body[`docType_${i}`];
                const description = req.body[`description_${i}`];

                if (!docType) {
                    return reject(`Missing document type for file ${i}`);
                }

                saveCitizenDocument({
                    file,
                    firstName: citizens[0].First_Name,
                    lastName: citizens[0].Last_Name,
                    citizenId,
                    docType
                })
                    .then((filePath) => {

                        db.query(
                            `
                        INSERT INTO DOCUMENT
                        (
                            DateUploaded,
                            Description,
                            FilePath,
                            C_ID,
                            Doc_Type
                        )
                        VALUES
                        (NOW(), ?, ?, ?, ?)
                        `,
                            [
                                description || null,
                                filePath,
                                citizenId,
                                docType
                            ],
                            (err) => {
                                if (err) return reject(err);
                                resolve();
                            }
                        );

                    })
                    .catch(reject);
            });
        });

        await Promise.all(uploadTasks);

        return sendSuccess(
            res,
            "Documents uploaded successfully",
            null
        );

    } catch (err) {
        console.log(err);

        return sendError(
            res,
            500,
            err.message || "Failed to upload documents",
            "UPLOAD_ERROR"
        );
    }
};

export const uploadComplaintDocuments = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 401, "Unauthorized", "NO_USER");
        }

        const complaintId = req.params.id;

        const [citizens] = await db.promise().query(
            `SELECT C_ID, First_Name, Last_Name
             FROM CITIZEN
             WHERE U_ID = ?`,
            [userId]
        );

        if (!citizens.length) {
            return sendError(res, 404, "Citizen profile not found", "CITIZEN_NOT_FOUND");
        }

        const citizenId = citizens[0].C_ID;
        const files = req.files;

        if (!files || files.length === 0) {
            return sendError(res, 400, "No files uploaded", "NO_FILES");
        }

        const SUPPORTING_DOC_TYPE = 15;

        const uploadTasks = files.map(async (file) => {

            const description =
                req.body.description || "Complaint supporting document";

            const savedFilePath = await saveCitizenDocument({
                file,
                firstName: citizens[0].First_Name,
                lastName: citizens[0].Last_Name,
                citizenId,
                docType: SUPPORTING_DOC_TYPE
            });

            await db.promise().query(
                `
                INSERT INTO DOCUMENT
                (DateUploaded, Description, FilePath, C_ID, Doc_Type, Comp_ID)
                VALUES (NOW(), ?, ?, ?, ?, ?)
                `,
                [
                    description,
                    savedFilePath,
                    citizenId,
                    SUPPORTING_DOC_TYPE,
                    complaintId
                ]
            );
        });

        await Promise.all(uploadTasks);

        return sendSuccess(
            res,
            "Complaint documents uploaded successfully"
        );

    } catch (err) {
        console.error(err);
        return sendError(
            res,
            500,
            "Failed to upload complaint documents",
            err.message
        );
    }
};