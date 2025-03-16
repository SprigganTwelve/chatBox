
const fs = require('fs')
const path = require("path")
const db = require("../database/connexion")




//Here we change the global properties settings which is not a large or a binary object

exports.changeGeneralSettingPropertyInBdd = async (req, res) => {
    try{
        const { key , value, id } = req.body
        const connexion = await db.connexion;
        if(!key || !value || !id){
            return res.status(500).json({ message: "Please provide all the fields needed in the body" })
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

exports.changeGeneralImageSettingPropertyInBdd = async (req, res) => {

    try{
        
    }
    catch{

    }

}