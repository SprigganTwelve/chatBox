
const multer = require('multer')
const express = require("express")
const router = express.Router()
const settingsController = require("../controller/settings.controller")

const storage = multer.memoryStorage()
const uploads = multer({ storage })

router.patch('/general/basics', settingsController.changeGeneralSettingPropertyInBdd)
router.post('/general/image', uploads.single('file') , settingsController.changeGeneralImageSettingsPropertyInBdd)
router.post('/talksphere/image', uploads.single('file') , settingsController.changeSpecificImageSettingsPropertyInBdd)


module.exports = router