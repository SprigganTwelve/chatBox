
const path = require('path')


exports.getUserFilesInParametersDirectory =  (req, res)=>{
    try{
        const { folder, filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/users', folder, 'parameters', filename);
        res.sendFile(filePath);
    }
    catch(err){
        console.log("Something wrong happenned")
        return res.status(400).json({ message: "Something wrong is up with the server"})
    }
}


exports.getTalksphereMedias =  (req, res )=>{
    try{
        const { folder, folder2, filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/talkspheres', folder, folder2, filename);
        console.log(filePath)
        res.sendFile(filePath);
    }
    catch(err){
        console.log("Something wrong happenned")
        return res.status(400).json({ message: "Something wrong is up with the server"})
    }
}