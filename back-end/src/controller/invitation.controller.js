
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
                SELECT consumer1Id FROM IsBeFriended WHERE consumer2Id = ${userId}
                UNION
                SELECT consumer2Id FROM IsBeFriended WHERE consumer1Id = ${userId}
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
    const conn = await db.connexion;
    const { senderId, receiverId } = req.body;

    try {
        await conn.beginTransaction();

        // Insert friendship in both directions in a single query
        const friendshipInsert = await conn.query(
            "INSERT INTO IsBeFriended(consumer1Id, consumer2Id) VALUES (?, ?), (?, ?)",
            [senderId, receiverId, receiverId, senderId]
        );

        if (friendshipInsert.affectedRows < 2) {
            throw new Error("Failed to insert friendship records");
        }

        // Delete the invitation
        const deleteInvitation = await conn.query(
            "DELETE FROM AssocRequest WHERE senderId = ? AND receiverId = ?",
            [senderId, receiverId]
        );

        if (deleteInvitation.affectedRows === 0) {
            throw new Error("Failed to delete the invitation");
        }

        // Create a new TalkSphere
        const talkSphereResponse = await conn.query("INSERT INTO TalkSphere () VALUES ()");

        if (talkSphereResponse.affectedRows === 0) {
            throw new Error("Failed to create TalkSphere");
        }

        const talkSphereId = talkSphereResponse.insertId;

        // Insert both users into ConsumerTalkSphere
        const consumerTalkSphereInsert = await conn.query(
            "INSERT INTO ConsumerTalkSphere (consumerId, talkSphereId) VALUES (?, ?), (?, ?)",
            [senderId, talkSphereId, receiverId, talkSphereId]
        );

        if (consumerTalkSphereInsert.affectedRows < 2) {
            throw new Error("Failed to insert users into ConsumerTalkSphere");
        }

        // Commit transaction
        await conn.commit();
        return res.status(200).json({ message: "Now you just have got a friend" });

    } catch (error) {
        await conn.rollback();
        console.error(error.message);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
