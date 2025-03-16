const express = require('express');
const router = express.Router();
const controller = require('../controllers/IncapacidadController');

const {
    createIncapacidad,
    getIncapacidades,
    getIncapacidadById,
    getIncapacidadesByEmpleado,
    updateIncapacidad
} = controller;

router.get('/', getIncapacidades);
router.post('/', createIncapacidad);
router.get('/:id', getIncapacidadById);
router.get('/empleado/:id', getIncapacidadesByEmpleado);
router.put('/:id', updateIncapacidad);

module.exports = router;