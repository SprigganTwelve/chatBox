
const express = require('express')
const router = express.Router()
const controller = require("../controller/invitation.controller")

router.get('/userVisible/:userId', controller.getUserVisible)
router.get('/userInvitation/:receiverId', controller.getUserInvitation)
router.post('/userAssocRequest/', controller.MakeAnAssocRequest)
router.post('/confirm/', controller.ConfirmAnInvitation)

module.exports  = router
