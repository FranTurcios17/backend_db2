const express = require('express');
const router = express.Router();
const controller = require('../controllers/DeduccionController');

router.get('/', controller.getDeducciones);
router.post('/', controller.createDeduccion);
router.get('/empleado/:id', controller.getDeduccionesEmpleado);
router.post('/asignar', controller.asignarDeduccion);
router.put('/desactivar/:id', controller.desactivarDeduccion);

module.exports = router;