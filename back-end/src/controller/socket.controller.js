const fs = require('fs')
const path = require('path')
const db = require("../database/connexion")

exports.insertIntoMessage = async ( { senderId, talkSphereId, content, createdAt, media, talkSphereFolder } ) => {
    
    const connexion = await db.connexion;
    await connexion.beginTransaction();
   
    try {
        let dateObj = createdAt instanceof Date ? createdAt : new Date(createdAt);
         
        if (isNaN(dateObj.getTime())) {
            console.error(`Date invalide reçue: ${createdAt}`);
            return; 
        }

        const formattedDate = dateObj.toISOString().slice(0, 19).replace("T", " ");

        const insertedMessage = await connexion.query(
            `INSERT INTO Message(content, sender_id, created_at, talksphere_id) values (?,?,?,?)`,
            [content, senderId, formattedDate, talkSphereId]
        );

        if(insertedMessage.affectedRows < 1){
            console.log("Failed to insert message in bdd")
            await connexion.rollback()
        }

        if(media){
            //Uploading Audio

            if(media.audio){
                const webmAudioName = Date.now() + '.' + media.audio.type
                const insertWebmAudio = connexion.query("INSERT INTO Media(message_id, name, type) VALUES(?,?,?)",
                    [insertedMessage.insertId, webmAudioName, "audio/" + media.audio.type ]
                )
                if(insertWebmAudio.affectedRows < 1){
                    console.log("Failed to insert audio media in bdd")
                    await connexion.rollback()
                }
                const audioPath = path.join(__dirname, `../uploads/talkspheres/${talkSphereFolder}/audios`, webmAudioName)
                const buffer = Buffer.from(media.audio.blob, 'binary');
                fs.writeFileSync(audioPath, buffer)
            }

            //Uploading Video

            if(media.video){
                const videoName = Date.now() + '.' + media.video.type
                const insertVideo = connexion.query("INSERT INTO Media(message_id, name, type) VALUES(?,?,?)",
                    [ insertedMessage.insertId, videoName, "video/"+ media.video.type  ]
                )

                if(insertVideo.affectedRows < 1){
                    console.log("Failed to insert video media in bdd")
                    await connexion.rollback()
                }

                const audioPath = path.join(__dirname, `../uploads/talkspheres/${talkSphereFolder}/video`, videoName)
                const buffer = Buffer.from(media.video.blob, 'binary');
                fs.writeFileSync(audioPath, buffer)
            }

            if(media.photos){
                //TODO: IMPLEMENT
            }
        }

        await connexion.commit()

    }
    catch (err) {
        await connexion.rollback()
        console.error("Erreur lors de l'insertion du message :", err);
    }
};
