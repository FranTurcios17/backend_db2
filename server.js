const express = require('express');
const app = express();
const parser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./models');
const empleadosRoutes = require("./src/routes/empleadosRoutes")



dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(parser.json());



app.use("/empleados", empleadosRoutes)
//console.log(process.env.DBNAME)

app.listen(PORT, async() =>
    {
        console.log("runing server in port: ", PORT);
        await db.sequelize.sync();
        console.log("synced db");
    });