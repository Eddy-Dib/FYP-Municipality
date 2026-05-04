import express from "express";
import {
    getCities,
    getStreetsByCity,
    getBuildingsByStreet,
    getLocationsByBuilding
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/cities", getCities);
router.get("/streets", getStreetsByCity);
router.get("/buildings", getBuildingsByStreet);
router.get("/locations", getLocationsByBuilding);

export default router;