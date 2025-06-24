
const db = require("../database/connexion")
const path = require('path')
const fs = require('fs')
const { PassThrough } = require('stream')



exports.getAllChatsStoredInBdd = async (req, res)=>{
    try {
        const { userId  } = req.params
        const conn = await db.connexion
        const response = await conn.query(`
            SELECT
                T.id AS id,
                T.folder AS talksphere_folder,

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
                        SELECT JSON_OBJECT('image', C.image, 'folder', C.folder)
                        FROM Consumer C
                        JOIN Consumer_Talksphere CT2 ON CT2.consumer_id = C.id
                        WHERE CT2.talksphere_id = T.id
                        AND CT2.consumer_id != CT.consumer_id
                        ORDER BY C.id ASC
                        LIMIT 1
                    )
                END AS image_data,

                -- Use talksphere.name if not null, otherwise get receiver's name
                CASE
                    WHEN T.name IS NOT NULL THEN T.name
                    ELSE (
                        SELECT C.name
                        FROM Consumer C
                        JOIN Consumer_Talksphere CT2 ON CT2.consumer_id = C.id
                        WHERE CT2.talksphere_id = T.id
                        AND C.id != ?
                        ORDER BY C.id ASC
                        LIMIT 1
                    )
                END AS name

            FROM Consumer_Talksphere CT
            JOIN Talksphere T ON CT.talksphere_id = T.id
            WHERE CT.consumer_id = ?;
        `, [userId, userId])
        
        return res.status(200).json(response);
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
                                'id', Me.id,
                                'name', Me.name,
                                'type', Me.type
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



exports.insertMessageIntoBdd = async ( req, res )=>{   
  try {

    const { userId, content,  talkSphereId, createdAt } = req.body

    console.log({content, userId, talkSphereId, createdAt})

    if(!userId || !talkSphereId || !createdAt  || !content ){
          return res.status(500).json({ message: "Mising or incorrect sent data" })
    }

    const connexion = await db.connexion;
    await connexion.beginTransaction();

    let dateObj = createdAt instanceof Date ? createdAt : new Date(createdAt);
         
    if (isNaN(dateObj.getTime())) {
      console.error(`Invalide  date : ${createdAt}`);
      return res.status(500).json({ message: "Invalide received date" }); 
    }

    const formattedDate = dateObj.toISOString().slice(0, 19).replace("T", " ");

    const insertedMessage = await connexion.query(
      `INSERT INTO Message(content, sender_id, created_at, talksphere_id) values (?,?,?,?)`,
      [content, userId, formattedDate, talkSphereId] 
    );

    if(insertedMessage.affectedRows < 1){
        console.log("Failed to insert message in bdd")
        await connexion.rollback()
        return res.status(500).json({ message: "Something went wrong while inserting message"})
    }

    await connexion.commit()
    return res.status(200).json({ message: "" })

  }
  catch(err){
    console.log("Something went wrong while inserting the message into the bdd", err)
    return res.status(500).json({ message: "Something went wrong"})
  }
}




exports.storeMediaIntoBdd = async (req, res)=>{
    try {

        const { userId, talkSphereId, media } = req.body

        if(!userId || !talkSphereId || !Array.isArray(media) ){
          return res.status(500).json({ message: "Mising or incorrect sent data" })
        }

        const conn = await db.connexion;
        await conn.beginTransaction();

        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const messageResult = await conn.query(
          'INSERT INTO Message (sender_id, created_at, talksphere_id) VALUES (?, ?, ?)',
          [userId, timestamp, talkSphereId]
        );

        if (messageResult.affectedRows < 1) {
          await conn.rollback();
          console.log('[DB ERROR] Insertion message échouée');
          return res.status(500).json({ message: "Something went wrong" });
        }

        for( const file of media ){
          const mediaResult = await conn.query(
            'INSERT INTO Media (message_id, name, type) VALUES (?, ?, ?)',
            [messageResult.insertId, file.name, file.type]
          );

          if (mediaResult.affectedRows < 1) {
            await conn.rollback();
            console.log('[DB ERROR] Insertion média échouée');
            return res.status(500).json({ message: "Something went wrong" });;
          }
        }

        await conn.commit();
      }
      catch (dbErr) {
        console.error('Erreur DB :', dbErr);
      }
}





exports.saveFiles = async (req, res) => {
  try {
    const userId = Number(req.headers['x-user-id']);
    const { talksphereId, talkSphereFolder } = req.params;
    const fileNameRaw = req.headers['x-filename'];
    const fileSize = parseInt(req.headers['x-file-size'], 10);
    const fileType = req.headers['x-file-type'];
    const fileName =  Date.now() + '_' + fileNameRaw;

    if (!talksphereId || !talkSphereFolder || !fileName || !fileSize || !fileType || !userId) {
      return res.status(400).json({ message: 'Paramètres manquants.' });
    }

    console.log("[functions : saveFiles], received data ", {talksphereId ,talkSphereFolder ,fileName ,fileSize , fileType ,userId} )

    let folder = 'documents';
    if (fileType.includes('image')) folder = 'photos';
    else if (fileType.includes('video')) folder = 'videos';

    const dirPath = path.join(__dirname, `../uploads/talkspheres/${talkSphereFolder}/${folder}`);
    fs.mkdirSync(dirPath, { recursive: true });
    
    const filePath = path.join(dirPath, fileName);
    const writeStream = fs.createWriteStream(filePath);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const passThrough = new PassThrough();
    let receivedBytes = 0;

    // Lecture du flux pour afficher la progression

    passThrough.on('data', (chunk) => {
      receivedBytes += chunk.length;
      const ratio = (receivedBytes / fileSize).toFixed(2);
      res.write(`PROGRESS:${ratio}\n`);
    });


    passThrough.on('error', (err) => {
      res.write(`ERROR:${err.message}\n`);
      res.end();
    });

    req.pipe(passThrough);         
    passThrough.pipe(writeStream) ; 

    req.on('end', async () => {
      res.write('DONE\n');
      res.end();
    });

    req.on('error', (err) => {
      res.write(`ERROR:${err.message}\n`);
      res.end();
    });

  }
  catch (err) {
    console.error('[SERVER ERROR]', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};