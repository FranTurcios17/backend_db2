const express = require('express');
const app = express();
const parser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors')
const db = require('./models');
const empleadosRoutes = require("./src/routes/empleadosRoutes")
const asistenciaRoutes = require("./src/routes/asistenciaRoutes")
const horariosRoutes = require("./src/routes/horarioRoutes")
const usuariosRoutes = require("./src/routes/usuariosRoutes")
const permisoRoutes = require("./src/routes/permisoRoutes")
const horasExtrasRoutes = require("./src/routes/horasExtrasRoutes");
const incapacidadesRoutes = require("./src/routes/incapacidadesRoutes");
const nominasRoutes = require("./src/routes/nominasRoutes");
const { verifyToken } = require("./src/middleware/auth");

const PORT = process.env.PORT || 3000;
app.use(parser.json());
//app.use(cors())

app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}))

// Login route is unprotected
app.use("/usuarios", usuariosRoutes);

// Protected routes with authentication middleware
app.use("/empleados", verifyToken, empleadosRoutes);
app.use("/asistencia", verifyToken, asistenciaRoutes);
app.use("/horarios", verifyToken, horariosRoutes);
app.use("/permisos", verifyToken, permisoRoutes);
app.use("/horasextras", verifyToken, horasExtrasRoutes);
app.use("/incapacidades", verifyToken, incapacidadesRoutes);
app.use("/nominas", verifyToken, nominasRoutes);
//console.log(process.env.DBNAME)

app.listen(PORT, async() =>
    {
        console.log("runing server in port: ", PORT);
        await db.sequelize.sync();
        console.log("synced db");
    });