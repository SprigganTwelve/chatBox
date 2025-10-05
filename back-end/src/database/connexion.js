require('dotenv').config()

const db = require("mariadb")
const isProd = process.env.NODE_ENV === "production"



const getConnection = async ()=>{
    const pool = db.createPool({
        port     : process.env.DB_PORT,
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        ...(isProd ? { ssl: { rejectUnauthorized: true } } : {})
    })
    const conn = await pool.getConnection()
    return conn
}

const connexion = getConnection()

module.exports = { connexion };