
const db = require("../database/connexion")

exports.getUserVisible = async (req,res) => {
    try{
        const conn = await db.connexion
        const response = await conn.query("SELECT id, name, image, avaibility FROM Consumer WHERE visibility = 1")
        res.status(200).json( response )
    }
    catch(err){
        console.log("Something went wrong, error : "+ err)
        res.status(500).json({ message: "Something went wrong" })
    }
}