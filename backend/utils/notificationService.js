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

export const sendCitizenStatusEmail = async ({
    email,
    status,
    username,
    password,
    citizenName
}) => {
    let subject = "";
    let text = "";

    if (status === "approved") {
        subject = "Account Approved";
        text = `Hello ${citizenName}, your account has been approved.\n\nUsername: ${username}\nPassword: ${password}`;
    }

    if (status === "rejected") {
        subject = "Account Rejected";
        text = `Hello ${citizenName}, your registration has been rejected.`;
    }

    if (status === "enabled") {
        subject = "Account Enabled";
        text = `Hello ${citizenName}, your account has been reactivated.`;
    }

    if (status === "disabled") {
        subject = "Account Disabled";
        text = `Hello ${citizenName}, your account has been disabled.`;
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
        reqId: null,
        feeId: null
    });
};