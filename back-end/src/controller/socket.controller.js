//Used By the socket

const db = require('../database/connexion')

exports.insertIntoMessage = async (data) => {
    try{
        const { senderId, talkSphereId, content  } = data;
        const connexion = await db.connexion;
        const date = new Date();
        const data = await connexion.query("INSERT INTO Message(content, senderId, createdAt, talkSphereId) values (?,?,?,?)", [content, senderId, date, talkSphereId]);
        return { talkSphereId, content }
    }
    catch(err){
        console.log(err)
    }
}