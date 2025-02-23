const express = require('express');
const app = express();
const parser = require('body-parser');

const PORT = process.env.PORT || 3000;
app.use(parser.json());

app.listen(PORT, async() =>
    {
        console.log("runing server in port: ", PORT);
        //await db.sequelize.sync();
        //console.log("synced db");
    });