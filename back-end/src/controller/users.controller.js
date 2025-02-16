
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
    try{
        const conn = await db.connexion;
        const users = await conn.query(`SELECT * FROM Consumer WHERE id=${req.params.id}`)
        return  res.status(200).json( users )
    }
    catch(err){
        console.log(err)
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
