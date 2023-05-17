var express = require('express');
var router = express.Router();
router.use(express.json());
const createHttpError = require('http-errors');
const authController = require('../controllers/auth.controller');


router.post('/', authController.login);

module.exports = router