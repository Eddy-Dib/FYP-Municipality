import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const createComplaint = async (req, res) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return sendError(res, 401, "Unauthorized", "NO_USER");
		}

		const [citizens] = await db.promise().query(
			`SELECT C_ID
      		FROM CITIZEN
      		WHERE U_ID = ?`,
			[userId]
		);

		if (!citizens.length) {
			return sendError(res, 404, "Citizen profile not found", "CITIZEN_NOT_FOUND");
		}

		const citizenId = citizens[0].C_ID;

		const {
			type,
			details
		} = req.body;

		if (!type || !details) {
			return sendError(res, 400, "Missing fields", "MISSING_FIELDS");
		}

		const [result] = await db.promise().query(
			`INSERT INTO COMPLAINT 
        (Subject, Details, CType, C_ID)
       VALUES (?, ?, ?, ?)`,
			[
				"User Complaint",
				details,
				type,
				citizenId
			]
		);

		return sendSuccess(res, "Complaint created", {
			insertId: result.insertId
		});

	} catch (err) {
		console.error(err);
		return sendError(res, 500, "Error creating complaint", err.message);
	}
};

export const getComplaints = async (req, res) => {
	try {
		const [rows] = await db.promise().query(
			`SELECT 
        		c.Cmpt_ID,
        		c.Subject,
        		c.Details,
        		c.DateMade,
        		c.DateResolved,
        		c.DateRejected,
        		ct.CType_Name
      		FROM COMPLAINT c
      		JOIN COMPLAINT_TYPE ct ON c.CType = ct.CType_ID
      		ORDER BY c.DateMade DESC`
		);

		return sendSuccess(res, "Complaints fetched", rows);

	} catch (err) {
		return sendError(res, 500, "Error fetching complaints", err.message);
	}
};

export const approveComplaint = async (req, res) => {
	try {
		const { id } = req.params;

		const [result] = await db.promise().query(
			`UPDATE COMPLAINT 
       		SET DateResolved = NOW(), DateRejected = NULL
       		WHERE Cmpt_ID = ?`,
			[id]
		);

		return sendSuccess(res, "Complaint resolved", {
			affectedRows: result.affectedRows
		});

	} catch (err) {
		return sendError(res, 500, "Error resolving complaint", err.message);
	}
};

export const rejectComplaint = async (req, res) => {
	try {
		const { id } = req.params;

		const [result] = await db.promise().query(
			`UPDATE COMPLAINT 
       		SET DateRejected = NOW(), DateResolved = NULL
       		WHERE Cmpt_ID = ?`,
			[id]
		);

		return sendSuccess(res, "Complaint rejected", {
			affectedRows: result.affectedRows
		});

	} catch (err) {
		return sendError(res, 500, "Error rejecting complaint", err.message);
	}
};
export const getComplaintTypes = async (req, res) => {
	try {
		const [rows] = await db.promise().query(
			`SELECT CType_ID, CType_Name FROM COMPLAINT_TYPE`
		);

		return sendSuccess(res, "Types fetched", rows);
	} catch (err) {
		return sendError(res, 500, "Error fetching types", err.message);
	}
};

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

	const DEFAULT_CTYPE = 10;

	const query = `
        INSERT INTO COMPLAINT 
        (Subject, Details, DateMade, CType, C_ID)
        VALUES (?, ?, NOW(), ?, ?)
    `;

	db.query(query, ["General Message", message, DEFAULT_CTYPE, C_ID], (err, result) => {
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
