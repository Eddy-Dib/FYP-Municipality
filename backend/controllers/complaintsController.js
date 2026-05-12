import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const createComplaint = async (req, res) => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return sendError(res, 401, "Unauthorized", "NO_USER");
		}

		const [citizens] = await db.promise().query(
			`SELECT C_ID,
			First_Name,
			Last_Name,
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
			locationId,
			description
		} = req.body;

		if (!type || !description) {
			return sendError(res, 400, "Missing fields", "MISSING_FIELDS");
		}

		let locationString = "N/A";

		const locationQuery = `
			SELECT 
				ci.City_Name,
				s.Street_Name,
				b.Building_Name,
				l.Floor
			FROM LOCATION l
			LEFT JOIN BUILDING b ON l.Building_ID = b.Building_ID
			LEFT JOIN STREET s ON b.Street_ID = s.Street_ID
			LEFT JOIN CITY ci ON s.City_ID = ci.City_ID
			WHERE l.Location_ID = ?
		`;

		const [locRows] = await db.promise().query(locationQuery, [locationId]);

		if (locRows.length) {
			const loc = locRows[0];
			locationString = `${loc.City_Name} - ${loc.Street_Name} - ${loc.Building_Name} - Floor ${loc.Floor}`;
		}

		const details = `
			Name: ${citizens[0].First_Name} ${citizens[0].Last_Name}
			Location: ${locationString}
			Description: ${description}
			`

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

export const sendMessage = async (req, res) => {
	try {

		const userId = req.user?.id;

		if (!userId) {
			return sendError(
				res,
				401,
				"Unauthorized",
				"NO_USER"
			);
		}

		const { message } = req.body;

		if (!message) {
			return sendError(
				res,
				400,
				"Message is required",
				"MISSING_MESSAGE"
			);
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
			return sendError(
				res,
				404,
				"Citizen profile not found",
				"CITIZEN_NOT_FOUND"
			);
		}

		const citizenId = citizens[0].C_ID;

		const DEFAULT_CTYPE = 10;

		const details = 
			`Name: ${citizens[0].First_Name} ${citizens[0].Last_Name}
			Description: ${message}
			`
		const [result] = await db.promise().query(
			`
			INSERT INTO COMPLAINT 
			(Subject, Details, DateMade, CType, C_ID)
			VALUES (?, ?, NOW(), ?, ?)
			`,
			[
				"General Message",
				details,
				DEFAULT_CTYPE,
				citizenId
			]
		);

		return sendSuccess(
			res,
			"Message sent successfully",
			{
				insertId: result.insertId
			}
		);

	} catch (err) {

		console.error(err);

		return sendError(
			res,
			500,
			"Error sending message",
			err.message
		);
	}
};
