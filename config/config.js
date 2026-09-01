require('dotenv').config();

const baseConfig = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'database_development',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  dialect: process.env.DB_DIALECT || 'mysql',
};

module.exports = {
  development: {
    ...baseConfig,
    database: process.env.DB_NAME || 'database_development',
  },
  test: {
    ...baseConfig,
    database: process.env.DB_NAME_TEST || 'database_test',
  },
  production: {
    ...baseConfig,
    database: process.env.DB_NAME_PRODUCTION || 'database_production',
  },
};
