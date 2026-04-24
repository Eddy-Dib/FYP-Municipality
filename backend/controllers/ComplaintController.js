import db from "../config/db.js";

export const sendMessage = (req, res) => {
    const { message, C_ID } = req.body;

    if (!message) {
        return res.json({
            success: false,
            message: "Message is required",
            data: null,
            error: "Missing message"
        });
    }

    if (!C_ID) {
        return res.json({
            success: false,
            message: "Citizen ID is required",
            data: null,
            error: "Missing C_ID"
        });
    }

    const query = `
        INSERT INTO COMPLAINT 
        (Subject, Details, DateMade, C_ID)
        VALUES (?, ?, NOW(), ?)
    `;

    db.query(query, ["message", message, C_ID], (err, result) => {
        if (err) {
            return res.json({
                success: false,
                message: "Database error",
                data: null,
                error: err.message
            });
        }

        return res.json({
            success: true,
            message: "Message sent successfully to secretary",
            data: result,
            error: null
        });
    });
};