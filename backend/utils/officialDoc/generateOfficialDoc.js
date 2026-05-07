import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import { officialDocTemplate } from "./template.js";

const toBase64 = (filePath) => {
    return fs.readFileSync(filePath).toString("base64");
};

export const createIssuedDocumentFile = async ({
    request,
    citizen,
    mayorName,
    docRoot
}) => {

    const logoBase64 = toBase64(path.resolve("assets/logo.png"))
    const stampBase64 = toBase64(path.resolve("assets/stamp.png"))

    // const logoPath = `file:///${path.resolve("backend/assets/logo.png").replace(/\\/g, "/")}`;
    // const stampPath = `file:///${path.resolve("backend/assets/stamp.png").replace(/\\/g, "/")}`;

    // console.log(`${logoPath}\n${stampPath}`);

    const html = officialDocTemplate({
        requestNumber: request.RequestNumber,
        subject: request.RType_Name,
        fullName: `${citizen.First_Name} ${citizen.Last_Name}`,
        dateOfBirth: citizen.BirthDate,
        address: "UL Municipality Address Placeholder",
        issuedDate: new Date().toISOString().split("T")[0],
        mayorName,
        logoBase64,
        stampBase64
    });

    const citizenFolder = `${citizen.First_Name}.${citizen.Last_Name}${citizen.C_ID}`;

    const folder = path.join(docRoot, "municipality", citizenFolder, "issued_docs");
    fs.mkdirSync(folder, { recursive: true });

    const fileName = `issued-${request.Req_ID}-${Date.now()}.pdf`;
    const fullPath = path.join(folder, fileName);

    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--allow-file-access-from-files"
        ]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
        waitUntil: "networkidle0"
    });

    await page.evaluateHandle("document.fonts.ready");

    await page.pdf({
        path: fullPath,
        format: "A4",
        printBackground: true,
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();

    return fullPath;
};