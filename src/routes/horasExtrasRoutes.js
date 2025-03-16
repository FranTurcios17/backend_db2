const express = require('express');
const router = express.Router();
const controller = require('../controllers/HorasExtrasController');

const {
    createHoraExtra,
    getHorasExtras,
    getHoraExtraById,
    getHorasExtrasByEmpleado,
    updateHoraExtra,
    aprobarHoraExtra,
    rechazarHoraExtra
} = controller;

router.get('/', getHorasExtras);
router.post('/', createHoraExtra);
router.get('/:id', getHoraExtraById);
router.get('/empleado/:id', getHorasExtrasByEmpleado);
router.put('/:id', updateHoraExtra);
router.put('/aprobar/:id', aprobarHoraExtra);
router.put('/rechazar/:id', rechazarHoraExtra);

module.exports = router;