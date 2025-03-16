
const express = require("express")
const router = express.Router()
const settingsController = require("../controller/settings.controller")

const multer = require('multer')
const storage = multer.memoryStorage()
const uploads = multer({ storage })

router.post('/general/basics', settingsController.changeGeneralSettingPropertyInBdd)
router.post('/general/image', uploads.single('file') , settingsController.changeGeneralImageSettingPropertyInBdd)


module.exports = router