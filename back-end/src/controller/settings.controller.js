
const fs = require('fs')
const path = require("path")
const db = require("../database/connexion")




//Here we change the global properties settings which is not a large or a binary object

exports.changeGeneralSettingPropertyInBdd = async (req, res) => {
    try{
        const { key , value, id } = req.body
        const connexion = await db.connexion;
        if(!key || !id || (value == null || value == undefined) ){
            return res.status(500).json({ message: "Props missing" })
        }
        const response = await connexion.query(`UPDATE Settings SET ${key} = ${value} WHERE id=${id}`)
        if(response.affectedRows > 0 ) return res.status(200).json({ message: "The operartion is successful" })
        return res.status(500).json({ message: "Something went wrong" })
    }
    catch(error){
        console.log("[route: setting/ ; function:  changeGeneralSettingPropertyInBdd] Something went wrong, error : ", error)
        return res.status(400).json({ message: "Something went wrong while modifying the settings table in database" })
    }
}



//Here we change the global image setting in the database 

exports.changeGeneralImageSettingsPropertyInBdd = async (req, res) => {

    const conn = await db.connexion;
    await conn.beginTransaction()

    try{
        const file = req.file;
        const { id, opacity, folder } = req.body;
        console.log()
        if(file && id && opacity && folder){

            const filename = Date.now() +"_customize_theme_"+ file.originalname

            //Check if there is an existing custoized theme and delete it from storage 

            const imageResponse = await conn.query(
                "SELECT * FROM Settings WHERE id=?",
                [ id ]
            )
            if (!imageResponse.length) {
                await conn.rollback()
                return res.status(500).json({ message: "No existing theme is set in the db" })
            }

            const theme = imageResponse[0].theme

            if ( theme && theme.includes('_customize_theme_')) {
                const lastImagePath = path.join(__dirname, "../uploads/users/parameters/", folder, theme )
                fs.unlinkSync(lastImagePath)
            }

            //------------End

            //load the new image into the db

            const filePath = path.join(__dirname,  "../uploads/users/parameters/", folder)
            const completeFilePath = path.join(filePath, filename)
            fs.writeFile(completeFilePath, file.buffer, async (err) => {
                if (err) {
                    console.log(
                        "[POST, function: changeGeneralImageSettingPropertyInBdd] Something wront while inserting asynchronously file"
                    )
                    await conn.rollback()
                    return res.status(500).json({ message: "Failed to insert image"})
                }
                const response = await  conn.query(
                    "UPDATE Settings SET theme = ? , opacity = ? WHERE id=? ",
                    [ filename, opacity, id ]
                )
                console.log(response)
                if(response.affectedRows === 0) {
                    await conn.rollback()
                    return res.status(500).json({ message: "Failed to insert image"})
                }
                await conn.commit()
                return res.status(200).json({ message: "Image sucessfully added"})
            })
            //------------end
        }
    }
    catch(error){
        await conn.rollback()
        console.log("[POST, function: changeGeneralImageSettingPropertyInBdd] Something went wrong : ", error)
        return res.status(400).json({message: "Failed to insert image"})
    }

}

//Here we change a speciific chat image

exports.changeSpecificImageSettingsPropertyInBdd = async (req, res) => {
    try{
        const { id } = req.body
    }
    catch(err){
        console.log("[POST, function: changeSpecificImageSettingsPropertyInBdd] something went wrong")
        return res.status(400).json({message: "Failed to insert image"})
    }
}