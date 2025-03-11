
const express = require('express')
const router = express.Router()
const controller = require("../controller/talksphere.controller")

router.get( '/:id', controller.getTalkSphere)
router.get("/messages/:id", controller.getMessagesFromTalkSphere )

module.exports = router; 