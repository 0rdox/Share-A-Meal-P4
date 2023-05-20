var express = require('express');
var router = express.Router();
router.use(express.json());
const createHttpError = require('http-errors');
const signUpController = require('../controllers/signUp.controller');
const authController = require('../controllers/auth.controller');


// UC-401 Aanmelden voor maaltijd
router.post('/:mealid/participate', authController.validateToken, signUpController.signUpMeal);

// UC-402 Afmelden voor maaltijd
router.delete('/:mealid/participate', authController.validateToken, signUpController.deleteSignUpMeal);

// UC-403 Opvragen van deelnemers
router.get('/:mealid/participants', authController.validateToken, signUpController.getAllParticipants);

// UC-404 Opvragen van details van deelnemer
router.get('/:mealid/participants/:participantid', signUpController.getParticipantById);

module.exports = router;