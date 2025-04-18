const express = require('express')
const router = express.Router()
const multer = require("multer")
const path = require('path')
const controller = require("../controller/users.controller")


const storage = multer.memoryStorage()

const upload = multer({ storage })

router.get( '/', controller.getAllUsers )
router.get( '/:id', controller.getSpecialUser )
router.get( '/:id/friends', controller.getMyFriends )
router.delete( '/delete/:id', controller.deleteOneUserAccount )
router.post( '/login', upload.none() ,controller.getLoginConnection )
router.patch( '/', controller.changeValueInClientInBDDWithKeyAndValue )
router.post( '/signUp', upload.array("files", 1), controller.getSignedUpToBDD )
router.post( '/profile/image', upload.single("file"), controller.changeImageProfil )

module.exports = router