const assert = require('assert');
const pool = require('../utils/mysql-db');

//TODO:
//Createmeal works, uses the CookId from logged in user.
//deletemeal works, if user is not the owner it can't be deleted
//Getmeal dates return null

const signUpController = {
    signUpMeal: (req, res, next) => {

    },
    deleteSignUpMeal: (req, res, next) => {

    },
    getAllParticipants: (req, res, next) => {

        // GET MEALID
        const mealId = req.params.mealid;

        // SQL FOR GETTING ALL PARTICIPANTS
        const getAllSql = `SELECT * FROM \`meal_participants_user\` WHERE \`mealId\`= ${mealId}`;
        // SQL FOR CHECKING COOKID
        const selectMealSql = `SELECT cookId FROM \`meal\` WHERE \`id\` = ${mealId}`;

        // CONNECTION
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
                return;
            }
            if (conn) {
                conn.query(selectMealSql, function(err, results, fields) {
                    if (err) {
                        next({
                            status: 500,
                            message: err.message,
                        });
                    }
                    if (results.length === 0) {
                        res.status(404).json({
                            status: 404,
                            message: `Meal with id ${mealId} not found`,
                            data: {}
                        });
                        return;
                    }

                    const cookId = results[0].cookId;

                    // VERIFY OWNER
                    if (cookId != req.userId) {
                        res.status(403).json({
                            status: 403,
                            message: "User is not the owner of this data",
                            data: {}
                        });
                        return;
                    }

                    conn.query(getAllSql, function(err, results2, fields) {
                        if (err) {
                            next({
                                status: 500,
                                message: err.message,
                            });
                            return;
                        }

                        res.status(200).json({
                            status: 200,
                            message: "All participants",
                            data: results2
                        });

                    });
                });
            }
        });
    },
    getParticipantById: (req, res, next) => {
        // GET PARTICIPANT ID
        const participantId = req.params.participantid;

        // SQL FOR GETTING PARTICIPANT BY ID
        const getParticipantSql = `SELECT * FROM \`user\` WHERE \`id\`= ${participantId}`;

        // CONNECTION
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
                return;
            }
            if (conn) {
                conn.query(getParticipantSql, function(err, results, fields) {
                    if (err) {
                        next({
                            status: 500,
                            message: err.message,
                        });
                        return;
                    }
                    if (results.length === 0) {
                        res.status(404).json({
                            status: 404,
                            message: `Participant with id ${participantId} not found`,
                            data: {}
                        });
                        return;
                    }

                    res.status(200).json({
                        status: 200,
                        message: "Participant details",
                        data: results[0]
                    });
                });
            }
        });
    },


}

module.exports = signUpController