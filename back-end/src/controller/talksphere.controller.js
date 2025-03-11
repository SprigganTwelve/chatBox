
const db = require("../database/connexion")

//Used By router

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
        const data = await connexion.query("SELECT id, content, createdAt, senderId FROM Message where talkSphereId = ?",[id])
        if (data.length > 0) {
            return res.status(200).json(data);
        }
        return res.status(400).json({ message: "Something went wrong while retreiving the data" });
    }
    catch(err){
        console.log(`Something wrong hapenned : ${err}`)
        return res.status(404).json({ message: "Something wrong happend" })
    }
}

