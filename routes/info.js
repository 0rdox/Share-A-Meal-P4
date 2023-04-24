var express = require('express');
var router = express.Router();
const infoController = require('../controllers/info.controller')

//Get INFO
router.get('/', infoController.getInfo);

module.exports = router;