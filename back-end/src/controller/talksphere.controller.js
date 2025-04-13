
const db = require("../database/connexion")

//Used By router

exports.getTalkSphere = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        
        if(!senderId || !receiverId ) {
            console.log("[GET, function: getTalkSphere], Props missing")
            return res.status(500).json({ message: "Props missing" })
        }

        const conn = await db.connexion;

        // Requête pour trouver une TalkSphere commune
        const data = await conn.query(`
            SELECT t.* 
            FROM Talksphere t
            JOIN Consumer_talksphere c1 ON t.id = c1.talksphere_id
            JOIN Consumer_talksphere c2 ON t.id = c2.talksphere_id
            WHERE c1.consumer_id = ? AND c2.consumer_id = ?;
        `, [senderId, receiverId]);
        console.log("Talksphere")
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
        const data = await connexion.query("SELECT id, content, created_at, sender_id FROM Message where talksphere_id = ?",[id])
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

