const controller = require("../controllers/usuarioController");
const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const { loginUser, cambiarContrasena } = controller;

router.post("/login", loginUser);

router.post("/changePass/:id", verifyToken, cambiarContrasena);

module.exports = router;