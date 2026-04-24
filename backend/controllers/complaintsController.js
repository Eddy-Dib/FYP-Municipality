import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

// ================= CREATE =================
export const createComplaint = async (req, res) => {
  try {
    const { subject, details, c_id } = req.body;

    const [result] = await db.promise().query(
      `INSERT INTO COMPLAINT (Subject, Details, DateMade, C_ID)
       VALUES (?, ?, NOW(), ?)`,
      [subject, details, c_id]
    );

    return sendSuccess(res, "Complaint created", {
      Cmpt_ID: result.insertId,
      subject,
      details,
      c_id
    });

  } catch (err) {
    return sendError(res, 500, "Error creating complaint", err.message);
  }
};

// ================= GET ALL =================
export const getComplaints = async (req, res) => {
  try {
    const [complaints] = await db.promise().query(
      `SELECT * FROM COMPLAINT`
    );

    return sendSuccess(res, "All complaints", complaints);

  } catch (err) {
    return sendError(res, 500, "Error fetching complaints", err.message);
  }
};

// ================= RESOLVE =================
export const approveComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      `UPDATE COMPLAINT 
       SET DateResolved = NOW()
       WHERE Cmpt_ID = ?`,
      [id]
    );

    return sendSuccess(res, "Complaint resolved", result);

  } catch (err) {
    return sendError(res, 500, "Error resolving complaint", err.message);
  }
};

// ================= DELETE =================
export const rejectComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      `DELETE FROM COMPLAINT WHERE Cmpt_ID = ?`,
      [id]
    );

    return sendSuccess(res, "Complaint deleted", result);

  } catch (err) {
    return sendError(res, 500, "Error deleting complaint", err.message);
  }
};