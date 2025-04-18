
const express = require('express')
const router = express.Router()

const fileProviderController = require('../controller/files.provider.controller')


router.get('/users/:folder/parameters/:filename', fileProviderController.getUserFilesInParametersDirectory );

router.get('/talksphere/:folder/:folder2/:filename', fileProviderController.getTalksphereMedias);


module.exports = router