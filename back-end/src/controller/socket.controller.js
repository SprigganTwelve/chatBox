const db = require("../database/connexion")

exports.insertIntoMessage = async ({ senderId, talkSphereId, content, createdAt }) => {
    try {
        const connexion = await db.connexion;

        let dateObj = createdAt instanceof Date ? createdAt : new Date(createdAt);

        if (isNaN(dateObj.getTime())) {
            console.error(`Date invalide reçue: ${createdAt}`);
            return; 
        }

        const formattedDate = dateObj.toISOString().slice(0, 19).replace("T", " "); 

        console.log(formattedDate);

        await connexion.query(
            "INSERT INTO Message(content, sender_id, created_at, talksphere_id) values (?,?,?,?)",
            [content, senderId, formattedDate, talkSphereId]
        );
    } catch (err) {
        console.error("Erreur lors de l'insertion du message :", err);
    }
};
