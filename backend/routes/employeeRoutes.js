const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Employee Dashboard
router.get("/dashboard/:empId", employeeController.getDashboard);

module.exports = router;