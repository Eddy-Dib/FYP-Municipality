import db from "../config/db.js";

import {
    sendSuccess,
    sendError
} from "../utils/responses.js";

import { saveCitizenDocument } from "../utils/documentHandler.js";

/* ========================= */
/* GET DOCUMENT TYPES */
/* ========================= */

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

/* ========================= */
/* UPLOAD DOCUMENTS (FIXED) */
/* ========================= */

export const uploadDocuments = async (req, res) => {
    try {
        console.log(req.user);

        const citizenId = req.user.id;
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
                    firstName: "Citizen",
                    lastName: "User",
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