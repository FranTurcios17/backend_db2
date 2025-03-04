const express = require('express');
const router = express.Router();
const controller = require('../controllers/EmpleadoController');


const {createEmpleado, getEmpleados, getEmpleadoById} = controller;

router.get("/", getEmpleados)
router.post("/", createEmpleado)
router.post("/:id", getEmpleadoById)

module.exports = router;




