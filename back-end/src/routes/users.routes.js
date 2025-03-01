const express = require('express')
const router = express.Router()
const multer = require("multer")
const path = require('path')
const controller = require("../controller/users.controller")


const storage = multer.memoryStorage()

const upload = multer({ storage })

router.get( '/', controller.getAllUsers)
router.post( '/login', upload.none(),controller.getLoginConnection)
router.post('/signUp', upload.single("file"), controller.getSignedUpToBDD)
router.patch('/:id/:key/:value', controller.changeKeyValueInBDD)
router.get( '/:id', controller.getSpecialUser)
router.get( '/:id/friends', controller.getMyFriends)

module.exports = router