import fs from "fs";
import path from "path";

export const saveCitizenDocument = async ({
    file,
    firstName,
    lastName,
    citizenId,
    docType
}) => {
    if (!file) return null;

    const baseDir = process.env.DOC_ROOT;

    if (!baseDir) {
        throw new Error("DOC_ROOT is not defined in .env");
    }

    const citizenFolder = `${firstName}.${lastName}${citizenId}`;
    const safeDocType = String(docType).trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");

    const finalDir = path.join(baseDir, "municipality", citizenFolder, safeDocType);

    fs.mkdirSync(finalDir, { recursive: true });

    const ext = path.extname(file.originalname);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const fileName = `${safeDocType}-${timestamp}${ext}`;

    const finalPath = path.join(finalDir, fileName);

    fs.writeFileSync(finalPath, file.buffer);

    return finalPath;
};


export const toPublicPath = (fullPath) => {
    if (!fullPath) {
        return null;
    };

    const normalized = fullPath.replace(/\\/g, "/");

    const base = process.env.DOC_ROOT.replace(/\\/g, "/");
    return normalized.replace(base, "/files");
};