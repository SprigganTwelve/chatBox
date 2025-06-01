
const fs = require('fs')
const path = require('path')
const bcrypt = require("bcrypt")
const { v4: uuidv4 } =require('uuid')
const db = require("../database/connexion")



exports.getUserVisible = async (req,res) => {
    try{
        const { userId } = req.params
        const conn = await db.connexion
        const response = await conn.query(
           `SELECT id, name, image, availability, folder
            FROM Consumer
            WHERE visibility = 1
            AND id NOT IN (SELECT receiver_id FROM Assoc_request WHERE sender_id = ${userId})
            AND id NOT IN (SELECT sender_id FROM Assoc_request WHERE receiver_id = ${userId})
            AND id NOT IN (
                SELECT consumer_id FROM Is_befriended WHERE friend_id = ${userId}
                UNION
                SELECT friend_id FROM Is_befriended WHERE consumer_id = ${userId}
            );
            `,
        )
        return res.status(200).json( response )
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
        console.log(receiverId)
        const conn = await db.connexion
        const assocRequestReponse =  await conn.query(
            "SELECT * FROM Assoc_request WHERE receiver_id = ?",
            [receiverId]
        )
        if (assocRequestReponse.length > 0) {
            for(const request of assocRequestReponse){
                const userResponse = await conn.query(
                    "SELECT id, name, image, folder, availability FROM Consumer WHERE id=?",
                    [request.sender_id]
                )
                console.log(userResponse)
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
            "INSERT INTO assoc_request(sender_id, receiver_id) VALUES(?,?)",
            [senderId, receiverId]
        )
        if (assocRequestReponse.affectedRows) {
            return res.status(200).json({ message: "Request completed successfully." })
        }
        else {
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
            "INSERT INTO Is_befriended(consumer_id, friend_id) VALUES (?, ?), (?, ?)",
            [senderId, receiverId, receiverId, senderId]
        );

        if (friendshipInsert.affectedRows < 2) {
            await conn.rollback()
            throw new Error("Failed to insert friendship records");
        }

        // Delete the invitation
        const deleteInvitation = await conn.query(
            "DELETE FROM assoc_request WHERE sender_id = ? AND receiver_id = ?",
            [senderId, receiverId]
        );

        if (deleteInvitation.affectedRows === 0) {
            await conn.rollback()
            throw new Error("Failed to delete the invitation");
        }

        // Create a new TalkSphere

        const folder =  uuidv4()
        const pathRepertory = path.join(__dirname, `../uploads/talkspheres/${folder}` )

        fs.mkdirSync( pathRepertory + "/audios", { recursive: true } )
        fs.mkdirSync( pathRepertory + '/videos', { recursive: true } )
        fs.mkdirSync( pathRepertory + '/photos', { recursive: true } )
        fs.mkdirSync( pathRepertory + '/documents', { recursive: true } )

        const areCreeatedFiles = !fs.existsSync(pathRepertory + "/audios") && !fs.existsSync( pathRepertory + '/videos' ) && !fs.existsSync(pathRepertory + '/photos');
        if(areCreeatedFiles){
            await conn.rollback()
            throw new Error("Failed to create the talksphere folder in local storage");
        }

        const talkSphereResponse = await conn.query(
            "INSERT INTO Talksphere (folder) VALUES (?)",
            [folder]
        );

        if (talkSphereResponse.affectedRows === 0) {
            throw new Error("Failed to create TalkSphere");
        }

        const talkSphereId = talkSphereResponse.insertId;

        // Insert both users into ConsumerTalkSphere
        const consumerTalkSphereInsert = await conn.query(
            "INSERT INTO consumer_talksphere (consumer_id, talksphere_id) VALUES (?, ?), (?, ?)",
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
