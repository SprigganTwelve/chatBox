
const db = require("../database/connexion")

//Used By router

exports.getTalkSphere = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params; 
        const conn = await db.connexion;
        // Requête pour trouver une TalkSphere commune
        const data = await conn.query(`
            SELECT t.* 
            FROM TalkSphere t
            JOIN ConsumerTalkSphere c1 ON t.id = c1.talkSphereId
            JOIN ConsumerTalkSphere c2 ON t.id = c2.talkSphereId
            WHERE c1.consumerId = ? AND c2.consumerId = ?;
        `, [senderId, receiverId]);

        // Vérifier si une TalkSphere existe
        if (data.length > 0) {
            return res.status(200).json(data[0]); // Renvoie la première TalkSphere trouvée
        } else {
            return res.status(404).json({ message: "No common TalkSphere found" });
        }
    } 
    catch (err) {
        console.log(`Something went wrong: ${err}`);
        return res.status(500).json({ message: "An error occurred" });
    }
};


exports.getMessagesFromTalkSphere = async (req, res) => {
    try{
        const { id } = req.params
        const connexion = await db.connexion;
        const data = await connexion.query("SELECT id, content, createdAt, senderId FROM Message where talkSphereId = ?",[id])
        if (data.length > 0) {
            return res.status(200).json(data);
        }
        return res.status(200).json([]);
    }
    catch(err){
        console.log(`Something wrong hapenned : ${err}`)
        return res.status(404).json({ message: "Something wrong happend" })
    }
}

