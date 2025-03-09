
const db = require("../database/connexion")


exports.getUserVisible = async (req,res) => {
    try{
        const { userId } = req.params
        const conn = await db.connexion
        const response = await conn.query(
           `SELECT id, name, image, availability
            FROM Consumer
            WHERE visibility = 1
            AND id NOT IN (SELECT receiverId FROM AssocRequest WHERE senderId = ${userId})
            AND id NOT IN (SELECT senderId FROM AssocRequest WHERE receiverId = ${userId})
            AND id NOT IN (
                SELECT consumer1Id FROM IsBeFriended WHERE consumer1Id = ${userId}
                UNION
                SELECT consumer2Id FROM IsBeFriended WHERE consumer2Id = ${userId}
            );
            `,
        )
        res.status(200).json( response )
    }
    catch(err){
        console.log("Something went wrong, error : "+ err)
        res.status(500).json({ message: "Something went wrong" })
    }
}



exports.getUserInvitation = async (req, res) => {
    try{
        const data = []
        const { receiverId } = req.params
        const conn = await db.connexion
        const assocRequestReponse =  await conn.query(
            "SELECT * FROM AssocRequest WHERE receiverId = ?",
            [receiverId]
        )
        if (assocRequestReponse.length > 0) {
            for(const request of assocRequestReponse){
                const userResponse = await conn.query(
                    "SELECT id, name, image, availability FROM Consumer WHERE id=?",
                    [request.senderId]
            )
                data.push(...userResponse)
            }
            return res.status(200).json(data)
        } else {
            console.log("Something went wrong while getting assoc information (No invitation found)")
            return res.status(500).json({ message: "No inventation sent to you" })
        }
    }
    catch(err){
        console.log(err)
        return res.status(400).json({ message: "Something went wrong" })
    }
}



exports.MakeAnAssocRequest = async (req, res) => {
    try{
        const { senderId, receiverId } = req.body
        const conn = await db.connexion
        const assocRequestReponse =  await conn.query(
            "INSERT INTO AssocRequest(senderId, receiverId) VALUES(?,?)",
            [senderId, receiverId]
        )
        if (assocRequestReponse.affectedRows) {
            return res.status(200).json({ message: "Request completed successfully." })
        } else {
            return res.status(400).json({ message: "Something went wrong while retreiving the data" })
        }
    }
    catch(err){
        console.log(err)
        return res.status(400).json({ message: "Something went wrong" })
    }
}


exports.ConfirmAnInvitation = async (req, res) => {
    try {
        const conn = await db.connexion;
        const { senderId, receiverId } = req.body;

        await conn.beginTransaction();

        const firstIsBeFriendedResponse = await conn.query(
            "INSERT INTO IsBeFriended(consumer1Id, consumer2Id) VALUES(?, ?)",
            [senderId, receiverId]
        );
        
        if (firstIsBeFriendedResponse.affectedRows > 0) {
            const secondIsBeFriendedResponse = await conn.query(
                "INSERT INTO IsBeFriended(consumer1Id, consumer2Id) VALUES(?, ?)",
                [receiverId, senderId]
            );
            
            if (secondIsBeFriendedResponse.affectedRows > 0) {
                const deleteInvitation = await conn.query(
                    "DELETE FROM AssocRequest WHERE senderId=? AND receiverId=?",
                    [senderId, receiverId]
                );
                
                if (deleteInvitation.affectedRows > 0) {
                    await conn.commit();
                    return res.status(200).json({ message: "Now you just have got a friend" });
                } else {
                    await conn.rollback();
                    console.log("Failed to delete the invitation");
                    return res.status(500).json({ message: "Something went wrong when deleting the invitation" });
                }

                //Create talksphere herer 

            } else {
                await conn.rollback();
                console.log("Failed to insert second record into IsBeFriended");
                return res.status(500).json({ message: "Something went wrong when inserting the second record into IsBeFriended" });
            }
        } else {
            await conn.rollback();
            console.log("Failed to insert first record into IsBeFriended");
            return res.status(500).json({ message: "Something went wrong when inserting the first record into IsBeFriended" });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Something went wrong" });
    }
};
