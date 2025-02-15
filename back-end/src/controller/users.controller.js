
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
};

exports.getSpecialUser = async (req, res) => {
    try{
        const conn = await db.connexion;
        const users = await conn.query(`SELECT * FROM Consummer WHERE id=${req.params.id}`)
        return  res.status(200).json( users )
    }
    catch(err){
        console.log(err)
    }
};

exports.getSpeechBetweenTwoUsers = async (req, res) => {
    try{
        const conn = await db.connexion;
        const { sender, receiver } = req.params;
        
    }
    catch (err)
    {
        console.log(`Something wrong hapenned : ${err}`)
        res.status(404).json({ message: "Something wrong happend" })
    }
}