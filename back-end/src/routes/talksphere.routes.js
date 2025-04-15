
const express = require('express')
const router = express.Router()
const controller = require("../controller/talksphere.controller")

router.get("/:userId", controller.getAllChatsStoredInBdd)
router.get( "/messages/:id", controller.getMessagesFromTalkSphere )
router.get( '/:senderId/:talksphereId', controller.getTalkSphere)

module.exports = router; 