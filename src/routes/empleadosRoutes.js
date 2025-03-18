const express = require('express');
const router = express.Router();
const controller = require('../controllers/EmpleadoController');

const {createEmpleado, getEmpleados, getEmpleadoById, updateEmpleados} = controller;

router.get("/", getEmpleados)
router.post("/", createEmpleado)
router.get("/:id", getEmpleadoById)
router.put("/:id", updateEmpleados)

module.exports = router;




