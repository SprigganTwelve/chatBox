
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
        const conn = await db.connexion;
        const response = await conn.query("SELECT * FROM Consumer WHERE id = ?", [req.params.id]);
        if (response.length > 0) {
            user = response[0]
        }
        return res.status(200).json(user);
    } catch (err) {
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
            const [ { talkSphereId } ] = await connexion.query("SELECT talkSphereId from ConsumerTalkSphere where consumerId= ?", [friendId.consumer2Id])
            const [{ name, image, description, online }] = await connexion.query("SELECT name, image, description, online FROM Consumer where id = ?", [friendId.consumer2Id] );
             allFriendData.push({ id: friendId.consumer2Id, name, image, description, online, talkSphereId })
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
        
        if(!name || !pseudo || !email || !password){
            return res.json( {message: "Fields must not be empty"} )
        }
        
        const conn = await db.connexion;
        
        const emailAlreadyExist = await conn.query("SELECT * FROM Consumer WHERE email = ? ", [email])
        if(emailAlreadyExist.length > 0){
            return res.json( { message: "Email already exist" } )
        }

        const hashPassword = await bcrypt.hash(password, saltRounds)
        const keyFriend = await bcrypt.hash( name + pseudo, saltRounds)
        const description = ``

        if(file){

            const fileName = Date.now() + path.extname(file.originalname)
            const fileUploadPath = path.join(__dirname, "../upload/")
            const filePath = path.join(fileUploadPath, fileName)


            user = await conn.query(
                "INSERT INTO Consumer(name, pseudo, email, password, image, keyFriend , description) VALUES(?,?,?,?,?,?,?)",
                [ name, pseudo, email, hashPassword, fileName, keyFriend, description ]
            )
            fs.writeFileSync(filePath, file.buffer)

            return res.status(200).json( { message: "" } )
        }
        else{
            user = await conn.query(
                "INSERT INTO Consumer(name, pseudo, email, password, keyFriend , description) VALUES(?,?,?,?,?,?)",
                [ name, pseudo, email, hashPassword, keyFriend, description  ]
            )
            return res.status(200).json( { message: "" } )
        }

    }
    catch(err){
        console.log(err)
        return res.status(404).json( { message: "Something went wrong" } )
    }
}