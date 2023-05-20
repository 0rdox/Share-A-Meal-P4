const assert = require('assert');
const pool = require('../utils/mysql-db');

//TODO:
//Createmeal works, uses the CookId from logged in user.
//deletemeal works, if user is not the owner it can't be deleted
//Getmeal dates return null

const mealController = {
    createMeal: (req, res, next) => {
        // CHECK IF LOGGED IN
        if (!req.userId) {
            return res.status(401).json({
                status: 401,
                message: 'User is not logged in.',
                data: {},
            });
        }

        const meal = {
            id: req.body.id,
            isActive: req.body.isActive,
            isVega: req.body.isVega,
            isVegan: req.body.isVegan,
            isToTakeHome: req.body.isToTakeHome,
            dateTime: req.body.dateTime,
            maxAmountOfParticipants: req.body.maxAmountOfParticipants,
            price: req.body.price,
            createDate: req.body.createDate,
            updateDate: req.body.updateDate,
            imageUrl: req.body.imageUrl,
            cookId: req.userId,
            name: req.body.name,
            description: req.body.description,
            allergenes: req.body.allergenes
        };

        // ASSERT
        try {
            assert(typeof meal.name === 'string' && meal.name.trim() !== '', 'Meal name must be a non-empty string');
        } catch (err) {
            // STATUS ERROR
            return res.status(400).json({
                status: 400,
                message: err.message.toString(),
                data: {},
            });
        }

        // SQL ESCAPE
        const escapedName = meal.name.replace(/'/g, "''");
        const escapedDescription = meal.description.replace(/'/g, "''");
        const escapedAllergenes = meal.allergenes.replace(/'/g, "''");

        const createMealSql = `INSERT INTO \`meal\` (\`id\`, \`isActive\`, \`isVega\`, \`isVegan\`, \`isToTakeHome\`, \`dateTime\`, \`maxAmountOfParticipants\`, \`price\`, \`imageUrl\`, \`cookId\`, \`createDate\`, \`updateDate\`, \`name\`, \`description\`, \`allergenes\`) 
            VALUES ('${meal.id}', ${meal.isActive}, ${meal.isVega}, ${meal.isVegan}, ${meal.isToTakeHome}, '${meal.dateTime}', ${meal.maxAmountOfParticipants}, ${meal.price}, '${meal.imageUrl}', ${meal.cookId}, '${meal.createDate}', '${meal.updateDate}', '${escapedName}', '${escapedDescription}', '${escapedAllergenes}')`;

        // SQL
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                return next('error: ' + err.message);
            }
            if (conn) {
                conn.query(createMealSql, function(err, results, fields) {
                    conn.release();
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(403).json({
                                status: 403,
                                message: `Meal with ID ${meal.id} already exists.`,
                                data: {}
                            });
                        } else {
                            return next({
                                status: 409,
                                message: err.message
                            });
                        }
                    } else {
                        const mealId = results.insertId;
                        meal.id = mealId;
                        return res.status(201).json({
                            status: 201,
                            message: `${meal.name} has been created`,
                            data: meal
                        });
                    }
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
    updateMeal: (req, res, next) => {
        const mealId = parseInt(req.params.mealid);

        // SELECT MEAL SQL
        const selectMealSql = `SELECT cookId FROM \`meal\` WHERE \`id\` = ${mealId}`;

        pool.getConnection((err, conn) => {
            if (err) {
                console.log('error', err);
                return next('error: ' + err.message);
            }

            conn.query(selectMealSql, (err, results, fields) => {
                if (err) {
                    conn.release();
                    return next({
                        status: 500,
                        message: err.message,
                    });
                }

                if (results.length === 0) {
                    conn.release();
                    return res.status(404).json({
                        status: 404,
                        message: `Meal with id ${mealId} not found`,
                        data: {},
                    });
                }

                const cookId = results[0].cookId;

                // VERIFY OWNER
                if (cookId != req.userId) {
                    conn.release();
                    return res.status(403).json({
                        status: 403,
                        message: "User is not the owner of this data",
                        data: {},
                    });
                }

                // CHECK MANDATORY UPDATE PARAMETERS
                if (!req.body.name || !req.body.price || !req.body.maxAmountOfParticipants) {
                    conn.release();
                    return res.status(400).json({
                        status: 400,
                        message: 'Name, price, and maxAmountOfParticipants are required',
                        data: {},
                    });
                }

                // //SETTING VALUES FOR UPDATED MEAL
                // const meal = results[0];
                // meal.isActive = req.body.isActive || meal.isActive;
                // meal.isVega = req.body.isVega || meal.isVega;
                // meal.isVegan = req.body.isVegan || meal.isVegan;
                // meal.isToTakeHome = req.body.isToTakeHome || meal.isToTakeHome;
                // meal.dateTime = req.body.dateTime || meal.dateTime;
                // meal.maxAmountOfParticipants = req.body.maxAmountOfParticipants || meal.maxAmountOfParticipants;
                // meal.price = req.body.price || meal.price;
                // meal.imageUrl = req.body.imageUrl || meal.imageUrl;
                // meal.createDate = req.body.createDate || meal.createDate;
                // meal.updateDate = req.body.updateDate || meal.updateDate;
                // meal.name = req.body.name || meal.name;
                // meal.description = req.body.description || meal.description;
                // meal.allergenes = req.body.allergenes || meal.allergenes;


                // // UPDATE MEAL SQL
                // const updateMealSql = `UPDATE \`meal\` SET \`isActive\`='${meal.isActive}', \`isVega\`='${meal.isVega}', \`isVegan\`='${meal.isVegan}', \`isToTakeHome\`='${meal.isToTakeHome}', \`dateTime\`='${meal.dateTime}', \`maxAmountOfParticipants\`='${meal.maxAmountOfParticipants}', \`price\`='${meal.price}', \`imageUrl\`='${meal.imageUrl}', \`createDate\`='${meal.createDate}', \`updateDate\`='${meal.updateDate}', \`name\`='${meal.name}', \`description\`='${meal.description}', \`allergenes\`='${meal.allergenes}' WHERE \`id\`=${mealId}`;

                const meal = {
                    price: req.body.price,
                    name: req.body.name,
                    maxAmountOfParticipants: req.body.maxAmountOfParticipants
                };

                // UPDATE MEAL SQL
                const updateMealSql = `UPDATE \`meal\` SET \`price\`='${meal.price}', \`name\`='${meal.name}', \`maxAmountOfParticipants\`='${meal.maxAmountOfParticipants}' WHERE \`id\`=${mealId}`;
                conn.query(updateMealSql, (err, results, fields) => {
                    conn.release();

                    if (err) {
                        return next({
                            status: 500,
                            message: err.message,
                        });
                    }

                    res.status(200).json({
                        status: 200,
                        message: `${meal.name} (${mealId}) has been updated`,
                        data: meal,
                    });
                });
            });
        });
    },

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