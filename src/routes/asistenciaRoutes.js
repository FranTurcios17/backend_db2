const express = require('express');
const router = express.Router();
const controller = require('../controllers/asistenciaController');


const {createEntrada,createSalida, getAsistencias, getAsistenciaPorEmpleado, updateAsistencia} = controller;

router.get("/", getAsistencias)
router.post("/entrada", createEntrada)
router.post("/salida", createSalida)
router.get("/:id", getAsistenciaPorEmpleado)
router.put("/:id", updateAsistencia)

module.exports = router;




