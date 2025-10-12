
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const pool = require("../database/connexion");


const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = async (req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const users = await conn.query("SELECT * FROM Consumer")
        return  res.status(200).json( users )
    }
    catch(err){
        console.log(err)
    }
    finally{
        if(conn) conn.release()
    }
};



exports.getSpecialUser = async (req, res) => {
    let conn;
    try {
        let user;
        conn = await pool.getConnection();
        const response = await conn.query(
            `
                SELECT 
                    C.id,
                    C.name,
                    C.image,
                    C.email,
                    C.pseudo,
                    C.folder,
                    C.online,
                    C.number,
                    C.key_friend,
                    C.visibility,
                    C.description,
                    C.availability,
                    C.doubleAuthentification,

                    S.id  AS settings_id,
                    S.full,
                    S.theme,
                    S.opacity,
                    S.dialect,
                    S.fontsize,
                    S.typing_indicator,
                    S.auto_delete_messages,
                    S.sound_notification,
                    S.read_receipts,
                    S.desktop_notification,
                    S.mention_notification

                FROM Consumer C INNER JOIN Consumer_Settings CS ON  C.id = CS.consumer_id 
                INNER JOIN Settings S ON CS.settings_id = S.id WHERE C.id = ?;
            `,
            [req.params.id]
        );
        if (response.length > 0) {
                user = response[0]
                return res.status(200).json(...response);
        }
        return res.status(400).json({ message: "User doen't exist" });
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
    finally{
        if(conn) conn.release()
    }
};



exports.getMyFriends = async (req, res) => {
    let connexion;
    try{
        const { id } = req.params;
        let allFriendData = [];
        connexion = await pool.getConnection();
        const friendIdArray = await connexion.query( "SELECT * from Is_BeFriended where consumer_id  = ?", [id]);
        
        for(const friendId  of friendIdArray){
            const [{ name, image, description, online }] = await connexion.query("SELECT name, image, description, online FROM Consumer where id = ?", [friendId.friend_id] );
             allFriendData.push({ id: friendId.friend_id, name, image, description, online })
        }

       return res.status(200).json( allFriendData )

    }
    catch(err){
        console.log(err)
    }
    finally{
        if(connexion) connexion.release()
    }
};



exports.getLoginConnection = async (req, res) => { 
    const { email, password } = req.body;

    if (!email || !password) return res.json({ message: "You must fill out the form" });

    let conn;
    try {
        conn = await pool.getConnection();
        const response = await conn.query(
            "SELECT id, password FROM Consumer WHERE email = ?", 
            [email]
        );

        if (response.length === 0) return res.json({ message: "User doesn't exist" });

        const user = response[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) 
            return res.json({ message: "Incorrect password" });
        delete user.password;
        await conn.query("UPDATE Consumer SET online= ? WHERE id=?", [1, user.id]);

        return res.status(200).json({ message: "", user });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    } finally {
        if (conn) conn.release(); // très important : libère la connexion
    }
};






exports.getSignedUpToBDD = async (req, res) => {
    let conn;
    try{
        let filePath;
        let fileName;
        let dynamicSqlRequest;
        let dynamicSqlParams;
        const saltRounds = 5
        const file = req.file
        const { name, pseudo, email, password } = req.body

        if(!name || !email || !password){
            return res.json( {message: "Name, email and password must not be empty"} )
        }
        
        conn = await pool.getConnection();
        
        const emailAlreadyExist = await conn.query("SELECT * FROM Consumer WHERE email = ? ", [email])
        if(emailAlreadyExist.length > 0){
            return res.json( { message: "Email already exist" } )
        }

        const folder = uuidv4(); 

        const hashPassword = await bcrypt.hash(password, saltRounds)
        const keyFriend = await bcrypt.hash( name + pseudo, saltRounds)
        const description = ``

        await conn.beginTransaction()
        
        const directoryPath = path.join(__dirname, `../uploads/users/${folder}/parameters`)
        fs.mkdirSync(directoryPath, { recursive: true })

        if (!fs.existsSync(directoryPath)) {
            console.log("[POST, function : getSignedUpToBDD] Something went wrong while create the user repertories")
            return res.status(500).json( { message: "Fail to create user's repertories" } )
        }

        if (file) {

            fileName = Date.now() + path.extname(file.originalname)
            const fileUploadPath = path.join(__dirname, `../uploads/users/${folder}/parameters`)
            filePath = path.join(fileUploadPath, fileName)
            dynamicSqlRequest  = "INSERT INTO Consumer(name, pseudo, email, password, image, key_friend , description, folder) VALUES(?,?,?,?,?,?,?,?)"
            dynamicSqlParams = [ name, pseudo, email, hashPassword, fileName, keyFriend, description, folder ] ;
            fs.writeFileSync(filePath, file.buffer)
        }
        else{

            dynamicSqlRequest =  "INSERT INTO Consumer(name, pseudo, email, password, key_friend , description, folder) VALUES(?,?,?,?,?,?, ?)"
            dynamicSqlParams = [ name, pseudo, email, hashPassword, keyFriend, description, folder ];
        }

        const userResponse = await conn.query(dynamicSqlRequest, dynamicSqlParams)

        if (userResponse.affectedRows < 1 ) {
            await conn.rollback()
            console.log("Something wrong happend while inserting the user [with file]")
            return res.status(500).json( { message: "Something wrong happend while inserting the user [with file]" } )
        }


        const settingsResponse = await conn.query("INSERT INTO Settings() VALUES ()")

        if(settingsResponse.affectedRows < 1){
            await conn.rollback()
            console.log("Something wrong happend while inserting the consumer_settings [with file]")
            return res.status(500).json( { message: "Something wrong happend while inserting the user [with file]" } )
        }

        const consumerSettingsResponse = await conn.query(
            "INSERT INTO Consumer_Settings(consumer_id, settings_id) VALUES (?,?)",
            [userResponse.insertId, settingsResponse.insertId]
        )

        if (consumerSettingsResponse.affectedRows < 1) {
            console.log("Something wrong happend while inserting the consumer_settings [with file]")
            return res.status(500).json({ message: "Something wrong happend while inserting the user [with file]" })
        }


        await conn.commit()
        return res.status(200).json( { message: "" } )

    }
    catch(err){
        console.log(err)
        return res.status(404).json( { message: "Something went wrong" } )
    }
    finally{
        if(conn) conn.release()
    }
}








exports.changeValueInClientInBDDWithKeyAndValue = async (req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const { id, key, value } = req.body;
        console.log({ id, key, value } )
        if(!id || !key || (value == null || value == undefined) ){
            return res.status(400).json( { message: "Props missing" } )
        }
        if (key !== "image" && key!=="password" && key !==  "key_friend" ) {
                await conn.query(`UPDATE Consumer SET ${key}=? WHERE id= ?`, [ value, id ])
                return res.status(200).json({  message: "" })
        }else{
            return res.status(200).json({ message: "you cannot update the image through this route" })
        }
    }
    catch(err){
        console.log("Something went wrong : " + err)
        return res.status(500).json( { message: "something went wrong" } )
    }
    finally{
        if(conn) conn.release()
    }
}




exports.changeImageProfil = async (req, res) => {
    let conn;
    try{
        const file = req.file
        conn = await pool.getConnection()

        const { id, opacity, folder } = req.body
        if(!id | !opacity | !file |!folder){
            return res.status(500).json({ message: "Missing props"})
        }

        const existingUser = await conn.query("SELECT image from Consumer WHERE id = ? ", [id])
        if (existingUser.length < 1 ) {
            console.log(" The referenced user doesn't exist in the database ")
            return res.status(500).json({ message: "Something went wrong"})
        }

        const userResult = existingUser[0];
        const filePath = path.join(__dirname, `../uploads/users/${folder}/parameters/`, userResult.image)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        
        await conn.beginTransaction()
        
        const fileName = Date.now() + file.originalname
        const completeFilePath = path.join(__dirname, `../uploads/users/${folder}/parameters/`, fileName )

        fs.writeFile(completeFilePath, file.buffer, async (err) => {
            if (err) {
                console.log("[POST, function: changeImageProfil] Something went wrong while inserting asynchronously file", err);
                await conn.rollback();
                return res.status(500).json({ message: "Failed to insert image" });
            }
        
            await conn.query("UPDATE Consumer SET image = ? WHERE id = ?", [fileName, id]); // tu mettais pas à jour la DB je pense ?
            await conn.commit();
            return res.status(200).json({ message: "Image successfully added" });
        });

    }
    catch(error){
        console.log("Something went wrong : " + error)
        return res.status(500).json( { message: "something went wrong" } )
    }
    finally {
        if(conn) conn.release()
    }
}



exports.deleteOneUserAccount = async (req, res) => {
    let conn;
    try{
        const userId = req.params.id
        if(!userId){
            console.log("[DELETE, function: deleteOneUserAccount ] Missing props")
            return res.status(500).json({ message: "Id is not passed" })
        }
        conn = await pool.getConnection()
        const [ selectedUserInBdd ] = await  conn.query("SELECT image FROM Consumer WHERE id = ?", [userId])

        if(!selectedUserInBdd){
            console.log("[DELETE, function: deleteOneUserAccount ] Id not found in bdd")
            return res.status(500).json({ message: "Id is not a correct or existing one" })
        }

        await conn.beginTransaction()
        const filePath = path.join(__dirname, `../uploads/users/${folder}/parameters/`, selectedUserInBdd.image)

        if(fs.existsSync(filePath)) {
            const deleteUserResponse = await conn.query("DELETE FROM Consumer WHERE id=?", [userId])
            if(deleteUserResponse.affectedRows < 1){
                await conn.rollback()
                console.log("Something went wrong while executing the delete request the user")
                return res.status(500).json({ message: "Something went wrong while deleting the user" })
            }
            fs.unlink(filePath, async (err)=>{
                if(err){
                    await conn.rollback()
                    console.log("[DELETE, function: deleteOneUserAccount ] Error while deleting the file from storage with fs, error: ", err)
                    return;
                }
                await conn.commit()
            })
        }
    }
    catch(error){
        console.log("Something went wrong : " + error)
        return res.status(500).json( { message: "something went wrong" } )
    }
    finally{
        if(conn) conn.release()
    }
}