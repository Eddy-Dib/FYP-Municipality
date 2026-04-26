import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const getComplaints = async (req, res) => {
  try {
    const [complaints] = await db.promise().query(
      `SELECT * FROM COMPLAINT ORDER BY DateMade desc`
    );

    return sendSuccess(res, "All complaints", complaints);

  } catch (err) {
    return sendError(res, 500, "Error fetching complaints", err.message);
  }
};

export const approveComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      `UPDATE COMPLAINT 
       SET DateResolved = NOW(),
           DateRejected = NULL
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
       SET DateRejected = NOW(),
           DateResolved = NULL
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