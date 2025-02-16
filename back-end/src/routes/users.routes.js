const express = require('express')
const router = express.Router()
const controller = require("../controller/users.controller")

router.get( '/', controller.getAllUsers)
router.get( '/:id', controller.getSpecialUser)
router.get( '/:id/friends', controller.getMyFriends)

module.exports = router