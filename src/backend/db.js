const mysql = require('mysql2');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = isProduction ? {
  host: process.env.DB_HOST_PROD,
  user: process.env.DB_USER_PROD,
  password: process.env.DB_PASSWORD_PROD,
  database: process.env.DB_NAME_PROD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
} : {
  host: process.env.DB_HOST_DEV,
  user: process.env.DB_USER_DEV,
  password: process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME_DEV,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(poolConfig);

module.exports = pool.promise();