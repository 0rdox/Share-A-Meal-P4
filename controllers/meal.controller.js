const assert = require('assert');
const pool = require('../utils/mysql-db');

//TODO:
//Createmeal works, uses the CookId from logged in user.
//deletemeal works, if user is not the owner it can't be deleted

const mealController = {
    createMeal: (req, res, next) => {

        const meal = {
            id: req.body.id,
            isActive: req.body.isActive === undefined ? true : req.body.isActive,
            isVega: req.body.isVega === undefined ? false : req.body.isVega,
            isVegan: req.body.isVegan === undefined ? false : req.body.isVegan,
            isToTakeHome: req.body.isToTakeHome === undefined ? true : req.body.isToTakeHome,
            dateTime: new Date(),
            maxAmountOfParticipants: req.body.maxAmountOfParticipants,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            cookId: req.userId,
            createDate: req.body.createDate || new Date(),
            updateDate: req.body.updateDate || new Date(),
            name: req.body.name,
            description: req.body.description,
            allergenes: req.body.allergenes
        };
        console.log(req.body);

        // ASSERT
        try {
            assert(typeof meal.name === 'string' && meal.name.trim() !== '', 'Meal name must be a non-empty string');
            assert(typeof meal.price === 'string', "Meal price must be a non-empty string");
        } catch (err) {
            // STATUS ERROR
            res.status(400).json({
                status: 400,
                message: err.message.toString(),
                data: {},
            });
            return;
        }
        const createMealSql = `INSERT INTO \`meal\` (\`id\`,\`isActive\`, \`isVega\`, \`isVegan\`, \`isToTakeHome\`, \`dateTime\`, \`maxAmountOfParticipants\`, \`price\`, \`imageUrl\`, \`cookId\`, \`createDate\`, \`updateDate\`, \`name\`, \`description\`, \`allergenes\`) 
        VALUES ('${meal.id}','${meal.isActive}', '${meal.isVega}', '${meal.isVegan}', '${meal.isToTakeHome}', '${meal.dateTime}', '${meal.maxAmountOfParticipants}', '${meal.price}', '${meal.imageUrl}', '${meal.cookId}', '${meal.createDate}', '${meal.updateDate}', '${meal.name}', '${meal.description}', '${meal.allergenes}')`;

        // SQL
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
            }
            if (conn) {
                conn.query(createMealSql, function(err, results, fields) {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            res.status(403).json({
                                status: 403,
                                message: `Meal with ID ${meal.id} already exists.`,
                                data: {}
                            });
                        } else {
                            next({
                                status: 409,
                                message: err.message
                            });
                        }
                    } else {
                        const mealId = results.insertId;
                        meal.id = mealId;
                        res.status(201).json({
                            status: 201,
                            message: `${meal.name} has been created`,
                            data: meal
                        });
                    }
                    conn.release();
                });
            }
        });
    },
    getAllMeals: (req, res, next) => {
        let sql = 'SELECT * FROM `meal` WHERE 1=1 ';

        // //FILTERS
        // if (Object.keys(req.query).length > 0) {
        //     if (firstName) {
        //         sql += `AND \`firstName\` = '${firstName}' `;
        //     }
        //     if (lastName) {
        //         sql += `AND \`lastName\` = '${lastName}' `;
        //     }
        //     if (emailAdress) {
        //         sql += `AND \`emailAdress\` = '${emailAdress}' `;
        //     }
        //     if (isActive !== undefined) {
        //         sql += `AND \`isActive\` = ${isActive} `;
        //     }
        //     if (street) {
        //         sql += `AND \`street\` = '${street}' `;
        //     }
        //     if (city) {
        //         sql += `AND \`city\` = '${city}' `;
        //     }
        //     //IF FILTERS DONT MATCH
        //     if (!firstName && !lastName && !emailAdress && isActive === undefined && !city && !street) {
        //         sql += 'AND 1=0 ';
        //     }
        // }

        //SQL CONNECTION
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
            }
            if (conn) {
                conn.query(sql, function(err, results, fields) {
                    if (err) {
                        next({
                            code: 409,
                            message: err.message
                        });

                    }
                    if (results) {
                        res.status(200).json({
                            status: 200,
                            message: 'Meal GetAll endpoint',
                            data: results,
                        })
                    }
                    conn.release();
                });
            }
        });
    },
    getMealById: (req, res, next) => {
        console.log(req.params)
        const mealId = parseInt(req.params.mealid);

        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
            }
            if (conn) {
                conn.query(`SELECT * FROM \`meal\` WHERE \`id\`=${mealId}`, function(err, results, fields) {
                    if (err) {
                        res.status(404).json({
                            status: 404,
                            message: `Meal with ID ${mealId} not found`,
                            data: {}
                        })
                    }

                    //
                    if (results.length == 1) {
                        res.status(200).json({
                            status: 200,
                            message: `Meal with ID ${mealId} found`,
                            data: results[0],
                        })
                    } else {
                        res.status(404).json({
                            status: 404,
                            message: `Meal with ID ${mealId} not found`,
                            data: {}
                        })
                    }

                    conn.release();
                });
            }
        });
    },
    //Extra
    updateMeal: (req, res, next) => {},
    deleteMeal: (req, res, next) => {
        const mealId = parseInt(req.params.mealid);

        //SELECT MEAL SQL
        const selectMealSql = `SELECT cookId FROM \`meal\` WHERE \`id\` = ${mealId}`;
        //CONNECTION
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
                        return;
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

                    //DELETE MEAL SQL
                    const deleteMealSql = `DELETE FROM \`meal\` WHERE \`id\` = ${mealId}`;

                    conn.query(deleteMealSql, function(err, results, fields) {
                        if (err) {
                            next({
                                status: 500,
                                message: err.message,
                            });
                            return;
                        }
                        res.status(200).json({
                            status: 200,
                            message: `Meal with id ${mealId} has been deleted`,
                            data: {}
                        });
                        conn.release();
                    });
                });
            }
        });
    }


}

module.exports = mealController;