
const db = require("../database/connexion")

exports.getAllChatsStoredInBdd = async (req, res)=>{
    try {
        const { userId  } = req.params
        const conn = await db.connexion
        const response = await conn.query(`
            SELECT
                T.id AS id,

                -- All other users in the talksphere except the sender
                (
                    SELECT GROUP_CONCAT(CT2.consumer_id)
                    FROM Consumer_Talksphere CT2
                    WHERE CT2.talksphere_id = T.id
                    AND CT2.consumer_id != CT.consumer_id
                ) AS receivers,

                -- Last message in the talksphere
                (
                    SELECT M.content
                    FROM Message M
                    WHERE M.talksphere_id = T.id
                    ORDER BY M.created_at DESC
                    LIMIT 1
                ) AS last_message,

                -- Use talksphere image if available, otherwise fallback to first other user's image
                CASE
                    WHEN T.image IS NOT NULL THEN T.image
                    ELSE (
                        SELECT C.image
                        FROM Consumer C
                        JOIN Consumer_Talksphere CT2 ON CT2.consumer_id = C.id
                        WHERE CT2.talksphere_id = T.id
                        AND CT2.consumer_id != CT.consumer_id
                        ORDER BY C.id ASC
                        LIMIT 1
                    )
                END AS image,

                -- Use talksphere.name if not null, otherwise get sender's name
                CASE
                    WHEN T.name IS NOT NULL THEN T.name
                    ELSE (
                        SELECT C.name
                        FROM Consumer C
                        WHERE C.id = CT.consumer_id
                        LIMIT 1
                    )
                END AS name

            FROM Consumer_Talksphere CT
            JOIN Talksphere T ON CT.talksphere_id = T.id
            WHERE CT.consumer_id = ?;
        `, [userId])
        
        if(response.length > 0){
            res.status(200).json(response)
            return;
        }
    } 
    catch (err) {
        console.log(`Something went wrong: ${err}`);
        return res.status(500).json({ message: "An error occurred" });
    }
}


//Here retrive all the field of one specific talksphere stored in bdd  

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

//Retreive all the messages about one talsphereId

exports.getMessagesFromTalkSphere = async (req, res) => {
    try{
        const { id } = req.params
        const connexion = await db.connexion;
        const data = await connexion.query(
            `
                SELECT 
                    M.id,
                    M.content,
                    M.sender_id,
                    M.created_at,
                    M.talksphere_id,
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', Me.id
                            )
                        )
                        FROM Media Me
                        WHERE Me.message_id = M.id
                    ) AS media
                FROM Message M
                WHERE M.talksphere_id = ?;

            `,
            [id]
        )
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

