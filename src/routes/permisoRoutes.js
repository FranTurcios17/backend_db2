const express = require('express');
const router = express.Router();
const controller = require('../controllers/PermisoController');

const {
    createPermiso,
    getPermisos,
    getPermisoById,
    getPermisosByEmpleado,
    updatePermiso,
    aprobarPermiso,
    rechazarPermiso
} = controller;

router.get('/', getPermisos);
router.post('/', createPermiso);
router.get('/:id', getPermisoById);
router.get('/empleado/:id', getPermisosByEmpleado);
router.put('/:id', updatePermiso);
router.put('/aprobar/:id', aprobarPermiso);
router.put('/rechazar/:id', rechazarPermiso);

module.exports = router;