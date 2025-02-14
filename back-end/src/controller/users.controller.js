
const db = require("../database/connexion")

exports.getUser = async (req, res) => {
    try{
        const conn = await db.connexion;
        const users = await conn.query("SELECT * FROM Consummer")
        return  res.status(200).json( users )
    }
    catch(err){
        console.log(err)
    }
}


;