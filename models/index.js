'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env] || {};
const db = {};

require('dotenv').config();

const initModels = require("./init-models");

const sequelize = new Sequelize(
  process.env.DB_NAME || process.env.DBNAME || config.database || 'database_development',
  process.env.DB_USER || process.env.USER || config.username || 'root',
  process.env.DB_PASSWORD || process.env.PASSWORD || config.password || null,
  {
    host: process.env.DB_HOST || process.env.HOST || config.host || '127.0.0.1',
    port: Number(process.env.DB_PORT || config.port || 3306),
    dialect: process.env.DB_DIALECT || config.dialect || 'mysql',
  }
);


//db.sequelize = sequelize;
//db.Sequelize = Sequelize;

//module.exports = db;

const models = initModels(sequelize);

module.exports = {
  ...models, sequelize, Sequelize
}