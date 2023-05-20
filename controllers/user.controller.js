const assert = require('assert');
const pool = require('../utils/mysql-db');


//TODO:
//Make UpdateUserID More efficient -> remove search user query



const userController = {
    getAllUsers: (req, res, next) => {
        const firstName = req.query.firstName;
        const lastName = req.query.lastName;
        const emailAdress = req.query.emailAdress;
        const isActive = req.query.isActive;
        const city = req.query.city;
        const street = req.query.street;
        const phoneNumber = req.query.phoneNumber;

        // FILTERS
        let sql = 'SELECT * FROM `user` WHERE 1=1 ';
        if (Object.keys(req.query).length > 0) {
            if (firstName) {
                sql += `AND \`firstName\` = '${firstName}' `;
            }
            if (lastName) {
                sql += `AND \`lastName\` = '${lastName}' `;
            }
            if (emailAdress) {
                sql += `AND \`emailAdress\` = '${emailAdress}' `;
            }
            if (isActive !== undefined) {
                sql += `AND \`isActive\` = ${isActive} `;
            }
            if (street) {
                sql += `AND \`street\` = '${street}' `;
            }
            if (city) {
                sql += `AND \`city\` = '${city}' `;
            }
            if (phoneNumber) {
                sql += ` AND \`phoneNumber\` = '${phoneNumber}'`;
            }
            // IF FILTERS DON'T MATCH
            if (!firstName && !lastName && !emailAdress && isActive === undefined && !city && !street && !phoneNumber) {
                sql += 'AND 1=0 ';
            }
        }

        // SQL CONNECTION
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
                return;
            }

            conn.query(sql, function(err, results, fields) {
                conn.release();
                if (err) {
                    next({
                        code: 409,
                        message: err.message
                    });
                }

                res.status(200).json({
                    status: 200,
                    message: 'User GetAll endpoint',
                    data: results,
                });
            });
        });
    },
    createUser: (req, res, next) => {

        let user; // Declare the user variable outside the if statement

        if (!req.body.id) {
            user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                street: req.body.street,
                city: req.body.city,
                isActive: req.body.isActive === undefined ? true : req.body.isActive,
                emailAdress: req.body.emailAdress,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
            };
        } else {
            user = {
                id: req.body.id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                street: req.body.street,
                city: req.body.city,
                isActive: req.body.isActive === undefined ? true : req.body.isActive,
                emailAdress: req.body.emailAdress,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
            };
        }




        //ASSERT
        try {
            assert(typeof user.firstName === 'string' && user.firstName.trim() !== '', 'First name must be a non-empty string');
            assert(typeof user.lastName === 'string' && user.lastName.trim() !== '', 'Last name must be a non-empty string');
            assert(typeof user.emailAdress === 'string' && validateEmail(user.emailAdress), 'Email Address must be a valid email address');
            assert(typeof user.password === 'string' && validatePassword(user.password), 'Password must be a valid password')
            assert(typeof user.phoneNumber === 'string' && validatePhoneNumber(user.phoneNumber), 'Phone number must be a valid phone number');
        } catch (err) {
            //STATUS ERROR
            return res.status(400).json({
                status: 400,
                message: err.message.toString(),
                data: {},
            });
        }

        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
            }
            if (conn) {
                const createUserSql = `INSERT INTO \`user\` (\`id\`,\`firstName\`, \`lastName\`, \`street\`, \`city\`, \`isActive\`, \`emailAdress\`, \`phoneNumber\`, \`password\`) 
        VALUES ('${user.id}','${user.firstName}', '${user.lastName}', '${user.street}', '${user.city}', ${user.isActive}, '${user.emailAdress}', '${user.phoneNumber}', '${user.password}')`;

                conn.query(createUserSql, function(err, results, fields) {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(403).json({
                                status: 403,
                                message: `User with email ${user.emailAdress} already exists.`,
                                data: {}
                            })
                        } else {
                            return next({
                                status: 409,
                                message: err.message,
                            });
                        }
                    }

                    if (results) {
                        res.status(201).json({
                            status: 201,
                            message: `User with Email-Address ${user.emailAdress} has been created`,
                            data: { user },
                        });
                    }
                    conn.release();
                });
            }
        })
    },
    getProfile: (req, res) => {
        const userId = req.userId;
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
            }


            if (conn) {
                conn.query(`SELECT * FROM \`user\` WHERE \`id\`= ${userId}`, function(err, results, fields) {
                    if (err) {
                        next({
                            status: 404,
                            message: err.message
                        });
                    }

                    if (results.length == 1) {
                        res.status(200).json({
                            status: 200,
                            message: `Your profile`,
                            data: results[0],
                        })
                    } else {
                        res.status(404).json({
                            status: 404,
                            message: `Profile not found`,
                            data: {}
                        })
                    }
                    conn.release();
                });
            }
        });
    },
    getUserId: (req, res, next) => {

        const userId = parseInt(req.params.userid);
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
            }


            if (conn) {
                conn.query(`SELECT * FROM \`user\` WHERE \`id\`=${userId}`, function(err, results, fields) {
                    if (err) {
                        res.status(404).json({
                            status: 404,
                            message: `User with ID ${userId} not found`,
                            data: {}
                        })
                    }

                    //
                    if (results.length == 1) {
                        res.status(200).json({
                            status: 200,
                            message: `User with ID ${userId} found`,
                            data: results[0],
                        })
                    } else {
                        res.status(404).json({
                            status: 404,
                            message: `User with ID ${userId} not found`,
                            data: {}
                        })
                    }
                    // if (results) {
                    //     res.status(200).json({
                    //         status: 200,
                    //         message: `User met ID ${userId} found`,
                    //         data: results[0],
                    //     })
                    //        }
                    conn.release();
                });
            }
        });
    },
    updateUserId: (req, res, next) => {
        const userId = parseInt(req.params.userid);

        if (!req.headers.authorization) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: {}
            });
        }

        // VERIFY TOKEN
        if (userId != req.userId) {
            return res.status(403).json({
                status: 403,
                message: "User is not the owner of this data",
                data: {}
            });
        }


        const userEmail = req.body.emailAdress;

        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                return next('error: ' + err.message);
            }

            // SEARCH USER
            if (conn) {
                conn.query(`SELECT * FROM \`user\` WHERE \`id\`=${userId}`, function(err, results, fields) {
                    if (err) {
                        conn.release();
                        return res.status(400).json({
                            status: 400,
                            message: `Error while retrieving user with UserID ${userId}`,
                            data: {},
                        });
                    }

                    if (results.length === 0) {
                        conn.release();
                        return res.status(404).json({
                            status: 404,
                            message: `User with ID ${userId} not found`,
                            data: {},
                        });
                    }

                    // UPDATE USER
                    const user = results[0];
                    user.firstName = req.body.firstName || user.firstName;
                    user.lastName = req.body.lastName || user.lastName;
                    user.street = req.body.street || user.street;
                    user.city = req.body.city || user.city;
                    user.isActive = req.body.isActive || user.isActive;
                    user.emailAdress = req.body.emailAdress || user.emailAdress;
                    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

                    if (!validatePhoneNumber(user.phoneNumber)) {
                        conn.release();
                        return res.status(400).json({
                            status: 400,
                            message: 'Invalid phone number',
                            data: {},
                        });
                    }

                    if (!userEmail) {
                        conn.release();
                        return res.status(400).json({
                            status: 400,
                            message: `Missing email`,
                            data: {},
                        });
                    }

                    // SAVE UPDATED USER
                    conn.query(
                        `UPDATE \`user\` SET \`firstName\`='${user.firstName}', \`lastName\`='${user.lastName}', \`street\`='${user.street}', \`city\`='${user.city}', \`isActive\`=${user.isActive ? 1 : 0}, \`emailAdress\`='${user.emailAdress}', \`phoneNumber\`='${user.phoneNumber}' WHERE \`id\`=${userId}`,
                        function(err, results, fields) {
                            conn.release();
                            if (err) {
                                return next({
                                    code: 500,
                                    message: err.message,
                                });
                            }

                            res.status(200).json({
                                status: 200,
                                message: `User with ID ${userId} has been updated`,
                                data: user,
                            });
                        }
                    );
                });
            }
        });
    },

    deleteUserId: (req, res, next) => {
        const userId = parseInt(req.params.userid);

        // VERIFY TOKEN
        if (userId !== req.userId) {
            return res.status(403).json({
                status: 403,
                message: "User is not the owner of this data",
                data: {},
            });
        }

        // SQL Query
        const sql = `DELETE FROM \`user\` WHERE \`id\` = ${userId}`;

        // Use pool connection to execute SQL query
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
                return;
            }

            conn.query(sql, (err, result) => {
                if (err) {
                    console.log('error', err);
                    next({
                        code: 409,
                        message: err.message,
                    });
                    return;
                }

                if (result.affectedRows === 0) {
                    res.status(404).json({
                        status: 404,
                        message: `User with ID ${userId} not found`,
                        data: {},
                    });
                } else {
                    res.status(200).json({
                        statusCode: 200,
                        message: `User with ID ${userId} has been deleted`,
                        data: {},
                    });
                }

                conn.release();
            });
        });
    },

};


//VALIDATION
function validateEmail(email) {
    //VALIDATES a.user@hotmail.com
    //VALIDATES user@hotmail.com
    const regex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
}

function validatePassword(pass) {
    //ATLEAST 1 NUMBER
    //ATLEAST 1 UPPERCASE
    //MINIMUM LENGTH 8
    const regex = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    return regex.test(pass);
}

function validatePhoneNumber(phoneNumber) {
    //VALIDATES 06 12345678 & 06-1234578
    const regex = /^(06)[- ]?\d{8}$/;
    return regex.test(phoneNumber);
}

module.exports = userController;