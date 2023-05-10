const assert = require('assert');
//const results = require('../utils/inmem-db');
const pool = require('../utils/mysql-db');

//TODO:
//getAllUsers - done
//createUser - done
//getProfile - done?
//getUserId - done
//updateUserId - 
//deleteUserId - done



const userController = {
    getAllUsers: (req, res, next) => {
        const firstName = req.query.firstName;
        const lastName = req.query.lastName;
        const emailAdress = req.query.emailAdress;
        const isActive = req.query.isActive;
        const city = req.query.city;
        const street = req.query.street;



        //FILTERS

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
            //IF FILTERS DONT MATCH
            if (!firstName && !lastName && !emailAdress && isActive === undefined && !city && !street) {
                sql += 'AND 1=0 ';
            }
        }

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
                            statusCode: 200,
                            message: 'User GetAll endpoint',
                            data: results,
                        })
                    }
                    conn.release();
                });
            }
        });
    },
    createUser: (req, res, next) => {
        const user = {
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            street: req.body.street,
            city: req.body.city,
            isActive: req.body.isActive === undefined ? true : req.body.isActive,
            emailAdress: req.body.emailAdress,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
        }


        // CHECK IF USER EXISTS IN DATABASE
        const checkUserSql = `SELECT * FROM \`user\` WHERE \`emailAdress\` = '${user.emailAdress}'`;
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
            }
            if (conn) {
                conn.query(checkUserSql, function(err, results, fields) {
                    if (err) {
                        next({
                            code: 409,
                            message: err.message
                        });
                    }
                    if (results.length > 0) {
                        res.status(403).json({
                            status: 403,
                            message: `User with Email-Address ${user.emailAdress} already exists`,
                            data: {},
                        });
                        conn.release();
                        return;
                    }

                    //ASSERT -- maybe place before connection
                    try {
                        assert(typeof user.firstName === 'string' && user.firstName.trim() !== '', 'First name must be a non-empty string');
                        assert(typeof user.lastName === 'string' && user.lastName.trim() !== '', 'Last name must be a non-empty string');
                        assert(typeof user.emailAdress === 'string' && validateEmail(user.emailAdress), 'Email Address must be a valid email address');
                        assert(typeof user.password === 'string' && validatePassword(user.password), 'Password must be a valid password')
                        assert(typeof user.phoneNumber === 'string' && validatePhoneNumber(user.phoneNumber), 'Phone number must be a valid phone number');
                    } catch (err) {
                        //STATUS ERROR
                        res.status(400).json({
                            status: 400,
                            message: err.message.toString(),
                            data: {},
                        });
                        conn.release();
                        return;
                    }

                    //INSERT USER INTO DATABASE
                    const createUserSql = `INSERT INTO \`user\` (\`id\`,\`firstName\`, \`lastName\`, \`street\`, \`city\`, \`isActive\`, \`emailAdress\`, \`phoneNumber\`, \`password\`) 
                        VALUES ('${user.id}','${user.firstName}', '${user.lastName}', '${user.street}', '${user.city}', ${user.isActive}, '${user.emailAdress}', '${user.phoneNumber}', '${user.password}')`;

                    conn.query(createUserSql, function(err, results, fields) {
                        if (err) {
                            next({
                                code: 409,
                                message: err.message,
                            });
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
                });
            }
        });
    },
    getProfile: (req, res) => {
        res.status(200).json({
            status: 200,
            message: 'Your profile',
            data: {
                id: 20,
                firstName: "John",
                lastName: "Evans",
                street: "Lovendijkstraat 61",
                city: "Breda",
                isActive: true,
                emailAdress: "j.evans@server.com",
                phoneNumber: "06 12426475"
            }
        });

        // if (!token) {
        //     res.status(401).json({
        //         status: 401,
        //         message: 'Invalid token',
        //         data: {}
        //     })
        // }
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
                        next({
                            code: 404,
                            message: err.message
                        });
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

        pool.getConnection(function(err, conn) {
            if (err) {
                console.log('error', err);
                next('error: ' + err.message);
            }

            //ASSERT


            //SEARCH USER
            if (conn) {
                conn.query(`SELECT * FROM \`user\` WHERE \`id\`=${userId}`, function(err, results, fields) {
                    if (err) {
                        next({
                            code: 404,
                            message: err.message
                        });
                    }


                    //UPDATE USER
                    if (results.length === 1) {
                        const user = results[0];
                        user.firstName = req.body.firstName || user.firstName;
                        user.lastName = req.body.lastName || user.lastName;
                        user.street = req.body.street || user.street;
                        user.city = req.body.city || user.city;
                        user.isActive = req.body.isActive || user.isActive;
                        user.emailAdress = req.body.emailAdress || user.emailAdress;
                        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;



                        //SAVE UPDATED USER
                        conn.query(`UPDATE \`user\` SET \`firstName\`='${user.firstName}', \`lastName\`='${user.lastName}', \`street\`='${user.street}', \`city\`='${user.city}', \`isActive\`=${user.isActive ? 1 : 0}, \`emailAdress\`='${user.emailAdress}', \`phoneNumber\`='${user.phoneNumber}' WHERE \`id\`=${userId}`, function(err, results, fields) {
                            if (err) {
                                next({
                                    code: 500,
                                    message: err.message
                                });
                            }

                            res.status(200).json({
                                status: 200,
                                message: `User with ID ${userId} has been updated`,
                                data: user
                            });
                        });
                    } else {
                        res.status(404).json({
                            status: 404,
                            message: `User with ID ${userId} not found`,
                            data: {}
                        });
                    }

                    conn.release();
                });
            }
        });
    },
    deleteUserId: (req, res, next) => {
        const userId = parseInt(req.params.userid);

        //SQL Query
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
                        message: err.message
                    });
                    return;
                }

                if (result.affectedRows === 0) {
                    res.status(404).json({
                        statusCode: 404,
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


//HASHMAP FOR PASSWORDS -> PROBABLY GETTING DELETED
var passwordMap = {};
passwordMap['j.evans@server.com'] = 'Eendenbeker12';
passwordMap['g.ernst@server.com'] = 'Gijskoektrommel1';
passwordMap['e.garm@server.com'] = '123PASS123';
passwordMap['d.crocker@server.com'] = 'Treasure1997'
passwordMap['w.poro@server.com'] = 'PoroPoro1990'


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
    //VALIDATES 061-242-5475 / xxx-xxx-xxxx
    const regex = /^\d{2}\s\d{8}$/;
    return regex.test(phoneNumber);
}

module.exports = userController;