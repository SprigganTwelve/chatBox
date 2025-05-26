
const express = require('express')
const router = express.Router()
const controller = require("../controller/talksphere.controller")
const multer = require('multer')
const storage = multer.memoryStorage()

const upload = multer({ storage }) 

router.get( "/:userId", controller.getAllChatsStoredInBdd )
router.get( "/messages/:id", controller.getMessagesFromTalkSphere )
router.get( '/:senderId/:talksphereId', controller.getTalkSphere  )

router.post('/message/:talksphereId/sendFiles', upload.single('audio'), controller.saveFiles )

module.exports = router; 