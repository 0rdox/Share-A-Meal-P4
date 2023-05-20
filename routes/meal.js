var express = require('express');
var router = express.Router();
router.use(express.json());
const createHttpError = require('http-errors');
const mealController = require('../controllers/meal.controller');
const authController = require('../controllers/auth.controller');

//UC-301 Toevoegen van maaltijden
//token
router.post('/', authController.validateToken, mealController.createMeal)

//UC-302 Wijzigen van maaltijdgegevens
router.put('/:mealid', authController.validateToken, mealController.updateMeal)

//UC-303 Opvragen van alle maaltijden
router.get('/', mealController.getAllMeals)

//UC-304 Opvragen van maaltijd bij ID
router.get('/:mealid', mealController.getMealById)

//UC-305 Verwijderen van maaltijd
//token + eigenaar van maaltijd
router.delete('/:mealid', authController.validateToken, mealController.deleteMeal)

module.exports = router;