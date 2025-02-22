
const express = require('express')
const router = express.Router()
const controller = require("../controller/invitation.controller")

router.get('/userVisible', controller.getUserVisible)

module.exports  = router
