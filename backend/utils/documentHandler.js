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

    const folderName = `${firstName}.${lastName}${citizenId}`;
    const finalDir = path.join(baseDir, "municipality", folderName);

    fs.mkdirSync(finalDir, { recursive: true });

    const ext = path.extname(file.originalname);

    const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");

    const safeDocType = String(docType).replace(/\s+/g, "_");

    const fileName = `${safeDocType}-${timestamp}${ext}`;

    const finalPath = path.join(finalDir, fileName);

    fs.writeFileSync(finalPath, file.buffer);

    return finalPath;
};