import nodemailer from "nodemailer";
import db from "../config/db.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendRequestStatusEmail = async ({
    email,
    status,
    requestNumber,
    reqId,
    title,
    reason
}) => {
    let subject = "";
    let text = "";

    if (status === "approved") {
        subject = "Request Approved";
        text = `Your request (${requestNumber} - ${title}) has been approved.`;
    }

    if (status === "rejected") {
        subject = "Request Rejected";
        text = `Your request (${requestNumber} - ${title}) was rejected.\n\nReason:\n${reason || "Not provided"}`;
    }

    await transporter.sendMail({
        from: `"Municipality System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text
    });

    await saveNotification({
        title: subject,
        text,
        reqId
    });
};

export const saveNotification = async ({
    title,
    text,
    reqId = null,
    feeId = null
}) => {
    await db.promise().query(
        `
        INSERT INTO NOTIFICATION (Title, Text, DateSent, Req_ID, Fee_ID)
        VALUES (?, ?, NOW(), ?, ?)
        `,
        [title, text, reqId, feeId]
    );
};