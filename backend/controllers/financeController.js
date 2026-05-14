// controllers/financialController.js

import db from "../config/db.js";

import { sendSuccess, sendError} from "../utils/responses.js";
import { generateFees } from "../utils/feeGenerator.js";
export const getLocationTypes = async (req, res) => {

    try {

        const [rows] = await db.promise().query(`
            SELECT
                LocT_ID,
                LocT_Type
            FROM LOCATION_TYPE
            ORDER BY LocT_Type ASC
        `);

        return sendSuccess( res, "Location types loaded successfully", rows);

    } catch (err) {

        console.log(err);

        return sendError( res, 500, "Failed to load location types", "LOCATION_TYPES_ERROR");
    }
};
export const getFeeSettingsOverview = async (req, res) => {

    try {
        const [taxRows] = await db.promise().query(`
            SELECT
                TaxSet_Code,
                TaxSet_Amt,
                TaxSet_Days_Threshold,
                TaxSet_Date
            FROM SETTINGS_TAX
            ORDER BY TaxSet_Date DESC
            LIMIT 1
        `);

        const currentTax = taxRows[0] || null;

        const [feeRows] = await db.promise().query(`
            SELECT
                sf.SetFee_ID,
                sf.SetFee_Name,
                sf.SetFee_Amt,
                sf.SetFee_Createdat,
                sf.Yearly_Flg,
                sf.Active_Flg,

                lt.LocT_ID,
                lt.LocT_Type

            FROM SETTING_FEES sf

            JOIN LOCATION_TYPE lt
                ON sf.LocT_ID = lt.LocT_ID

            ORDER BY sf.SetFee_Createdat DESC
        `);

        const formattedFees = feeRows.map((f) => ({
            id: f.SetFee_ID,
            name: f.SetFee_Name,
            amount: Number(f.SetFee_Amt),
            yearly: !!f.Yearly_Flg,
            active: !!f.Active_Flg,
            createdAt: f.SetFee_Createdat,
            locationType: {
                id: f.LocT_ID,
                name: f.LocT_Type
            }
        }));

        return sendSuccess(res, "Fee settings loaded successfully",{tax: currentTax, feeRules: formattedFees});

    } catch (err) {
        console.log(err);
        return sendError( res, 500, "Failed to load fee settings", "FEE_SETTINGS_ERROR");
    }
};

export const addFee = async (req, res) => {
    try {
        const { name, amount, yearly, locationTypeId } = req.body;

        if (!name || !amount || !locationTypeId) {
            return sendError( res, 400, "Missing required fields", "FEE_CREATE_MISSING_FIELDS");
        }

        const [result] = await db.promise().query(`
            INSERT INTO SETTING_FEES
                (SetFee_Name, SetFee_Amt, Yearly_Flg, LocT_ID, Active_Flg)
            VALUES (?, ?, ?, ?, 1)
        `, [
            name,
            amount,
            yearly ? 1 : 0,
            locationTypeId
        ]);

        const [locations] = await db.promise().query(`
            SELECT Location_ID
            FROM LOCATION
            WHERE LocT_ID = ?
        `, [locationTypeId]);

        if (!locations.length) {
            return sendSuccess(res, "Fee created but no locations found", {
                id: result.insertId
            });
        }

        const now = new Date();
        const dueDate = new Date(now);

        if (yearly) {
            dueDate.setFullYear(now.getFullYear() + 1);
        } else {
            dueDate.setMonth(now.getMonth() + 1);
        }

        const feeRows = locations.map(loc => [
            amount,
            dueDate,
            loc.Location_ID
        ]);

        await db.promise().query(`
            INSERT INTO FEE (Amount, DateExpected, Location_ID)
            VALUES ?
        `, [feeRows]);

        //await generateFees(new Date(), true);

        return sendSuccess( res, "Fee created successfully", { id: result.insertId });

    } catch (err) {
        console.log(err);
        return sendError( res, 500, "Failed to create fee", "FEE_CREATE_ERROR");
    }
};

export const editFee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, amount, yearly, locationTypeId } = req.body;

        if (!id) {
            return sendError(
                res,
                400,
                "Missing fee ID",
                "FEE_UPDATE_MISSING_ID"
            );
        }

        const [result] = await db.promise().query(`
            UPDATE SETTING_FEES
            SET SetFee_Name = ?,
                SetFee_Amt = ?,
                Yearly_Flg = ?,
                LocT_ID = ?
            WHERE SetFee_ID = ?
        `, [
            name,
            amount,
            yearly ? 1 : 0,
            locationTypeId,
            id
        ]);

        return sendSuccess( res, "Fee updated successfully", { affected: result.affectedRows });

    } catch (err) {
        console.log(err);
        return sendError( res, 500, "Failed to update fee", "FEE_UPDATE_ERROR");
    }
};

export const toggleFee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return sendError( res, 400, "Missing fee ID", "FEE_TOGGLE_MISSING_ID");
        }

        const [rows] = await db.promise().query(`
            SELECT Active_Flg
            FROM SETTING_FEES
            WHERE SetFee_ID = ?
        `, [id]);

        if (rows.length === 0) {
            return sendError( res, 404, "Fee not found", "FEE_NOT_FOUND");
        }

        const newStatus = rows[0].Active_Flg === 1 ? 0 : 1;

        await db.promise().query(`
            UPDATE SETTING_FEES
            SET Active_Flg = ?
            WHERE SetFee_ID = ?
        `, [newStatus, id]);

        return sendSuccess( res, "Fee status updated successfully", { active: !!newStatus });

    } catch (err) {
        console.log(err);
        return sendError( res, 500, "Failed to toggle fee", "FEE_TOGGLE_ERROR");
    }
};