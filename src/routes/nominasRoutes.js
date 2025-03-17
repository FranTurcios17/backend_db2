const express = require('express');
const router = express.Router();
const controller = require('../controllers/NominaController');

const {
    createNomina,
    getNominas,
    getNominaById,
    getNominasByEmpleado,
    getNominasByPeriodo,
    updateNomina
} = controller;

router.get('/', getNominas);
router.post('/', createNomina);
router.get('/:id', getNominaById);
router.get('/empleado/:id', getNominasByEmpleado);
router.get('/periodo/:periodo', getNominasByPeriodo);
router.put('/:id', updateNomina);

module.exports = router;