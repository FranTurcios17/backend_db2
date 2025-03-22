const express = require('express');
const router = express.Router();
const controller = require('../controllers/NominaController');

router.get("/", controller.getNominas);

router.get("/:id", controller.getNominaById);

router.get("/empleado/:id", controller.getNominasByEmpleado);

router.post("/", controller.createNomina);

router.post("/batch", controller.createBatchNominas);

module.exports = router;