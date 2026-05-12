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
            `
            SELECT C_ID, First_Name, Last_Name
            FROM CITIZEN
            WHERE U_ID = ?
            `,
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

        const docTypes = JSON.parse(req.body.docTypes || "[]");
        const descriptions = JSON.parse(req.body.descriptions || "[]");

        if (docTypes.length !== files.length) {
            return sendError(res, 400, "Mismatch between files and document types", "INVALID_PAYLOAD");
        }

        const [docTypeRows] = await db.promise().query(
            `SELECT Doc_Type_ID, Doc_Type_Name FROM DOC_TYPE`
        );

        const docTypeMap = new Map(
            docTypeRows.map(d => [Number(d.Doc_Type_ID), d.Doc_Type_Name])
        );

        const uploadTasks = files.map((file, i) => {
            return (async () => {
                const docTypeId = Number(docTypes[i]);
                const description = descriptions[i];

                if (!docTypeId) {
                    throw new Error(`Missing document type for file ${i}`);
                }

                const docTypeName = docTypeMap.get(docTypeId) || "unknown";

                const filePath = await saveCitizenDocument({
                    file,
                    firstName: citizens[0].First_Name,
                    lastName: citizens[0].Last_Name,
                    citizenId,
                    docTypeName
                });

                await db.promise().query(
                    `
                    INSERT INTO DOCUMENT
                    (DateUploaded, Description, FilePath, C_ID, Doc_Type)
                    VALUES (NOW(), ?, ?, ?, ?)
                    `,
                    [
                        description || null,
                        filePath,
                        citizenId,
                        docTypeId
                    ]
                );
            });
        });

        await Promise.all(uploadTasks);

        return sendSuccess(res, "Documents uploaded successfully", null);

    } catch (err) {
        console.log(err);

        return sendError(res, 500, err.message || "Failed to upload documents", "UPLOAD_ERROR");
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

            const savedFilePath = await saveCitizenDocument({
                file,
                firstName: citizens[0].First_Name,
                lastName: citizens[0].Last_Name,
                citizenId,
                docType: "Complaint_Document"
            });

            await db.promise().query(
                `
                INSERT INTO DOCUMENT
                (DateUploaded, FilePath, C_ID, Doc_Type, Comp_ID)
                VALUES (NOW(), ?, ?, ?, ?)
                `,
                [
                    savedFilePath,
                    citizenId,
                    SUPPORTING_DOC_TYPE,
                    complaintId
                ]
            );
        });

        await Promise.all(uploadTasks);

        return sendSuccess(res, "Complaint documents uploaded successfully");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to upload complaint documents", err.message);
    }
};

export const uploadRequestDocuments = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 401, "Unauthorized", "NO_USER");
        }

        const reqId = req.params.id;

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

        const docTypes = JSON.parse(req.body.docTypes || "[]");
        if (docTypes.length !== files.length) {
            return sendError(res, 400, "Document types mismatch", "DOC_TYPE_MISMATCH");
        }

        const [typesRows] = await db.promise().query(
            `SELECT Doc_Type_ID, Doc_Type_Name FROM DOC_TYPE`
        );

        const typeMap = new Map(
            typesRows.map(t => [String(t.Doc_Type_ID), t.Doc_Type_Name])
        );

        const uploadTasks = files.map((file, i) => {

            const docTypeId = docTypes[i];
            const docTypeName = typeMap.get(String(docTypeId));

            if (!docTypeName) {
                return Promise.reject(`Missing docType for file ${i}`);
            }

            return saveCitizenDocument({
                file,
                firstName: citizens[0].First_Name,
                lastName: citizens[0].Last_Name,
                citizenId,
                docType: docTypeName
            }).then((filePath) => {

                return db.promise().query(
                    `
                    INSERT INTO DOCUMENT
                    (DateUploaded, FilePath, C_ID, Doc_Type, Req_ID)
                    VALUES (NOW(), ?, ?, ?, ?)
                    `,
                    [
                        filePath,
                        citizenId,
                        docTypeId,
                        reqId
                    ]
                );
            });
        });

        await Promise.all(uploadTasks);

        return sendSuccess(res, "Request documents uploaded successfully");

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to upload request documents", err.message);
    }
};