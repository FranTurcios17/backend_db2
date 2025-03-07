const controller = require("../controllers/usuarioController")
const express = require('express');
const router = express.Router();

const { loginUser, cambiarContrasena } = controller;
//router.get("/", getEmpleados)
router.post("/login", loginUser)
router.post("/changePass/:id", cambiarContrasena)
//router.put("/:id", updateEmpleados)

module.exports = router;