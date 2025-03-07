'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

require('dotenv').config()



const initModels = require("./init-models");

const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST, 
    port: 3306, 
    dialect: "mysql"
  } 
)


//db.sequelize = sequelize;
//db.Sequelize = Sequelize;

//module.exports = db;

const models = initModels(sequelize);

module.exports = {
  ...models, sequelize, Sequelize
}