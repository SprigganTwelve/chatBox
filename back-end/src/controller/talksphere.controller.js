
const db = require("../database/connexion")

exports.getTalkSphere = async (req, res) => {
    try{
        const { id } = req.params;
        const conn = await db.connexion;
        const data = await conn.query("SELECT *  from TalkSphere where id = ?",[id])
        return data;
    }
    catch (err)
    {
        console.log(`Something wrong hapenned : ${err}`)
        return res.status(404).json({ message: "Something wrong happend" })
    }
}

exports.getMessagesFromTalkSphere = async (req, res) => {
    try{
        const { id } = req.params
        const connexion = await db.connexion;
        const data = await connexion.query("SELECT id, content, createdAt, senderId from Message where talkSphereId = ?",[id])
        return res.status(200).json(data);
    }
    catch(err){
        console.log(`Something wrong hapenned : ${err}`)
        return res.status(404).json({ message: "Something wrong happend" })
    }
}