const express = require('express');
const router = express.Router();
const controller = require('../controllers/NominaController');

// Get all payrolls (with pagination and optional filtering)
router.get("/", controller.getNominas);

// Get specific payroll by ID
router.get("/:id", controller.getNominaById);

// Get payrolls for a specific employee
router.get("/empleado/:id", controller.getNominasByEmpleado);

// Create a new payroll
router.post("/", controller.createNomina);

module.exports = router;