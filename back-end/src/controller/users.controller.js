
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const db = require("../database/connexion")


exports.getAllUsers = async (req, res) => {
    try{
        const conn = await db.connexion;
        const users = await conn.query("SELECT * FROM Consumer")
        return  res.status(200).json( users )
    }
    catch(err){
        console.log(err)
    }
};



exports.getSpecialUser = async (req, res) => {
    try {
        let user;
        console.log("jdjdj")
        const conn = await db.connexion;
        const response = await conn.query(
            `
                SELECT 
                    C.id,
                    C.name,
                    C.image,
                    C.pseudo,
                    C.online,
                    C.description,
                    C.keyFriend,
                    C.password,
                    C.email,
                    C.visibility,
                    C.availability,
                    C.number,
                    C.doubleAuthentification,

                    S.id  AS settings_id,
                    S.opacity,
                    S.typingIndicateur,
                    S.autoDeleteMessages,
                    S.soundNotification,
                    S.readReceipts,
                    S.desktopNotification,
                    S.mentionNotification,
                    S.themes,
                    S.dialect,
                    S.fontSize

                FROM Consumer C INNER JOIN Settings S ON  C.id = S.id WHERE C.id = ?;
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
};



exports.getMyFriends = async (req, res) => {
    try{

        const { id } = req.params;
        let allFriendData = [];
        const connexion = await db.connexion;
        const friendIdArray = await connexion.query( "SELECT * from IsBeFriended where consumer1Id = ?", [id]);
        
        for(const friendId  of friendIdArray){
            const [{ name, image, description, online }] = await connexion.query("SELECT name, image, description, online FROM Consumer where id = ?", [friendId.consumer2Id] );
             allFriendData.push({ id: friendId.consumer2Id, name, image, description, online })
        }

       return res.status(200).json( allFriendData )

    }catch(err){
        console.log(err)
    }
};


exports.getLoginConnection = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: "You must fill out the form" });
        }

        const conn = await db.connexion;

        const response = await conn.query(
            "SELECT id, password FROM Consumer WHERE email = ?", 
            [email]
        );

        if (response.length === 0) {
            return res.json({ message: "User doesn't exist" });
        }

        const user = response[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.json({ message: "Incorrect password" });
        }

        await conn.query(
            "UPDATE Consumer SET online= ? WHERE id=?", 
            [1, user.id]
        );

        delete user.password;

        return res.status(200).json({ message: "", user });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};






exports.getSignedUpToBDD = async (req, res) => {
    try{
        const saltRounds = 5
        const file = req.file
        const { name, pseudo, email, password } = req.body
        
        if(!name || !email || !password){
            return res.json( {message: "Name, email and password must not be empty"} )
        }
        
        const conn = await db.connexion;
        
        const emailAlreadyExist = await conn.query("SELECT * FROM Consumer WHERE email = ? ", [email])
        if(emailAlreadyExist.length > 0){
            return res.json( { message: "Email already exist" } )
        }

        const hashPassword = await bcrypt.hash(password, saltRounds)
        const keyFriend = await bcrypt.hash( name + pseudo, saltRounds)
        const description = ``

        await conn.beginTransaction()

        if(file){

            const fileName = Date.now() + path.extname(file.originalname)
            const fileUploadPath = path.join(__dirname, "../uploads/users/")
            const filePath = path.join(fileUploadPath, fileName)


            const userResponse = await conn.query(
                "INSERT INTO Consumer(name, pseudo, email, password, image, keyFriend , description) VALUES(?,?,?,?,?,?,?)",
                [ name, pseudo, email, hashPassword, fileName, keyFriend, description ]
            )

            if (userResponse.affectedRows > 0 ) {
                const settingsResponse = await conn.query(
                    "INSERT INTO Settings(consumerId) VALUES (?)",
                    [userResponse.insertId]
                )

                if(settingsResponse.affectedRows > 0){
                    await conn.commit()
                    fs.writeFileSync(filePath, file.buffer)
                    return res.status(200).json( { message: "" } )
                }
                else{
                    await conn.rollback()
                    console.log("Something wrong happend while inserting the settings [with file]")
                    return res.status(500).json( { message: "Something wrong happend while inserting the user [with file]" } )
                }

            }
            else{
                await conn.rollback()
                console.log("Something wrong happend while inserting the user [with file]")
                return res.status(500).json( { message: "Something wrong happend while inserting the user [with file]" } )
            }

        }
        else{
            const userResponse = await conn.query(
                "INSERT INTO Consumer(name, pseudo, email, password, keyFriend , description) VALUES(?,?,?,?,?,?)",
                [ name, pseudo, email, hashPassword, keyFriend, description  ]
            )


            if (userResponse.affectedRows > 0) {

                const settingsResponse = await conn.query(
                    "INSERT INTO Settings(consumerId) VALUES (?)",
                    [userResponse.insertId]
                )

                if (settingsResponse.affectedRows > 0) {
                    await conn.commit()
                    return res.status(200).json( { message: "" } )
                }
                else{
                    await conn.rollback()
                    console.log("Something wrong happend while inserting the settings [without file]")
                    return res.status(500).json( { message: "Something wrong happend while inserting the user [without file]" } )
                }

            }
            else{
                await conn.rollback()
                console.log("Something wrong happend while inserting the user [without file]")
                return res.status(500).json( { message: "Something wrong happend while inserting the user [without file]" } )
            }

        }

    }
    catch(err){
        console.log(err)
        return res.status(404).json( { message: "Something went wrong" } )
    }
}








exports.changeValueInClientInBDDWithKeyAndValue = async (req, res) => {
    try{
        const conn = await db.connexion;
        const { id, key, value } = req.body;
        if(!id || !key || value == undefined ){
            return res.status(400).json( { message: "Props missing" } )
        }
        if (key !== "image" && key!=="password" && key !==  "keyFriend" ) {
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
}