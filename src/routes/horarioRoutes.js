const express = require('express');
const router = express.Router();
const controller = require('../controllers/horarioController');


const {createHorario, getHorarios} = controller;

router.get("/", getHorarios)
router.post("/", createHorario)


module.exports = router;




