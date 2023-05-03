var express = require('express');
var router = express.Router();
router.use(express.json());
const createHttpError = require('http-errors');
const userController = require('../controllers/user.controller');


//Shows when there is a GET, POST, PUT or DELETE method being used
// router.use('*', (req, res, next) => {
//     const method = req.method;
//     console.log(`Method ${method} is called`);
//     next();
// });

//UC-201 Registreren als nieuwe user 
router.post('/', userController.createUser);

//UC-202 Opvragen overzicht van users 
router.get('/', userController.getAllUsers);

//UC-203 Opvragen van gebruikersprofiel 
router.get('/profile', userController.getProfile);

//UC-204 Opvragen van usergegevens bij ID 
router.get('/:userid', userController.getUserId);

//UC-205 Updaten van usergegevens
router.put('/:userid', userController.updateUserId);

//UC-206 Verwijderen van user 
router.delete('/:userid', userController.deleteUserId);


module.exports = router