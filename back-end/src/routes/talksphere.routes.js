
const express = require('express')
const router = express.Router()
const controller = require("../controller/talksphere.controller")
const multer = require('multer')
const storage = multer.memoryStorage()

const upload = multer({ storage }) 

router.get( "/:userId", controller.getAllChatsStoredInBdd )

router.get( "/messages/:id", controller.getMessagesFromTalkSphere )

router.get( '/:senderId/:talksphereId', controller.getTalkSphere  )

router.post('/messages/store', controller.insertMessageIntoBdd ) // Here we store/record a message in the bdd

router.post('/messages/store/files', controller.recordMediaIntoBdd ) // Here we store/record the files in the bdd using their name

router.post('/messages/:talksphereId/:talkSphereFolder/sendFiles', controller.saveFiles ) // Here we download the files into the storage (chunked transfer)

module.exports = router; 