const controller = require("../controllers/usuarioController");
const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const { loginUser, cambiarContrasena } = controller;

// Public routes
router.post("/login", loginUser);

// Protected routes
router.post("/changePass/:id", verifyToken, cambiarContrasena);

module.exports = router;