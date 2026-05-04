import db from "../config/db.js";
import { sendSuccess, sendError } from "../utils/responses.js";

export const getCities = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT City_ID, City_Name FROM CITY ORDER BY City_Name`
        );

        return sendSuccess(res, "Cities fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to fetch cities");
    }
};

export const getStreetsByCity = async (req, res) => {
    const { cityId } = req.query;

    if (!cityId) {
        return sendError(res, 400, "cityId is required");
    }

    try {
        const [rows] = await db.promise().query(
            `
            SELECT Street_ID, Street_Name, City_ID
            FROM STREET
            WHERE City_ID = ?
            ORDER BY Street_Name
            `,
            [cityId]
        );

        return sendSuccess(res, "Streets fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to fetch streets");
    }
};

export const getBuildingsByStreet = async (req, res) => {
    const { streetId } = req.query;

    if (!streetId) {
        return sendError(res, 400, "streetId is required");
    }

    try {
        const [rows] = await db.promise().query(
            `
            SELECT Building_ID, Building_Name, Street_ID
            FROM BUILDING
            WHERE Street_ID = ?
            ORDER BY Building_Name
            `,
            [streetId]
        );

        return sendSuccess(res, "Buildings fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to fetch buildings");
    }
};

export const getLocationsByBuilding = async (req, res) => {
    const { buildingId } = req.query;

    if (!buildingId) {
        return sendError(res, 400, "buildingId is required");
    }

    try {
        const [rows] = await db.promise().query(
            `
            SELECT 
                l.Location_ID,
                l.Floor,
                l.Size,
                l.Building_ID,
                lt.LocT_Type
            FROM LOCATION l
            JOIN LOCATION_TYPE lt ON l.LocT_ID = lt.LocT_ID
            WHERE l.Building_ID = ?
            ORDER BY l.Floor
            `,
            [buildingId]
        );

        return sendSuccess(res, "Locations fetched", rows);

    } catch (err) {
        console.error(err);
        return sendError(res, 500, "Failed to fetch locations");
    }
};