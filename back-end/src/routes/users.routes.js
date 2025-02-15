const express = require('express')
const router = express.Router()
const controller = require("../controller/users.controller")

router.get( '/', controller.getUser)
router.get( '/:id', controller.getSpecialUser)
router.get( '/messages/:sender/:receiver', controller.getSpeechBetweenTwoUsers)

module.exports = router