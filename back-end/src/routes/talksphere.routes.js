
const express = require('express')
const router = express.Router()
const controller = require("../controller/talksphere.controller")

router.get( "/messages/:id", controller.getMessagesFromTalkSphere )
router.get( '/:senderId/:receiverId', controller.getTalkSphere)

module.exports = router; 