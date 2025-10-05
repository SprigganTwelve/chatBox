require('dotenv').config()

const db = require("mariadb")
const isProd = process.env.NODE_ENV === "production"


const pool = db.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...(isProd ? { ssl: { rejectUnauthorized: true } } : {}),
  connectionLimit: 5
});

module.exports = pool;
