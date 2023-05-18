    const assert = require('assert');
    const pool = require('../utils/mysql-db');
    const jwt = require('jsonwebtoken')
    const jwtSecretKey = require('../utils/utils').jwtSecretKey;

    const authController = {
        login: (req, res, next) => {
            let { emailAdress, password } = req.body
            if (!emailAdress || !password) {
                next({
                    code: 404,
                    message: 'Missing EmailAddress or Password',
                })
            }

            const sql = 'SELECT id, firstName, lastName, emailAdress, password FROM user WHERE emailAdress = ?';
            //SQL CONNECTION
            pool.getConnection(function(err, conn) {
                if (err) {
                    console.log('error', err);
                    next('error: ' + err.message);
                }
                if (conn) {
                    conn.query(sql, [emailAdress], function(err, results, fields) {
                        if (err) {
                            next({
                                code: 409,
                                message: err.message
                            });
                        }

                        if (results[0]) {

                            const user = results[0]

                            //CHECK IF PASSWORD IS CORRECT
                            if (user.password === password) {
                                //GENERATE TOKEN
                                jwt.sign({ userid: user.id, emailAdress: user.emailAdress, password: user.password }, jwtSecretKey, { expiresIn: '7d' }, function(err, token) {
                                    if (err) console.log(err);
                                    if (token) {

                                        res.status(200).json({
                                            status: 200,
                                            data: {...results[0], token }
                                        })
                                    };
                                });

                            } else {
                                next({
                                    code: 400,
                                    message: 'Email and password dont match',
                                })
                            }
                        } else {
                            res.status(404).json({
                                status: 404,
                                message: `User with email: ${emailAdress} not found`
                            })
                        }
                        conn.release();

                    });
                }
            });
        },
        validateLogin(req, res, next) {
            try {
                assert(
                    typeof req.emailAdress === 'string',
                    'emailAdress must be a string.'
                );
                assert(
                    typeof req.password === 'string',
                    'password must be a string.'
                );
                next();
            } catch (ex) {
                res.status(422).json({
                    error: ex.toString(),
                    datetime: new Date().toISOString()
                });
            }
        },
        validateToken: (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                next({
                    code: 401,
                    message: 'Authorization header missing!',
                    data: undefined
                });
            } else {
                //Remove 'Bearer'
                const token = authHeader.substring(7, authHeader.length);


                jwt.verify(token, jwtSecretKey, (err, payload) => {
                    if (err) {
                        res.status(401).json({
                            code: 401,
                            message: err.message,
                            data: {}
                        });
                    }
                    if (payload) {
                        req.userId = payload.userid;
                        req.emailAdress = payload.emailAdress;
                        req.password = payload.password;
                        next();
                    }

                });
            }
        }
    }


    module.exports = authController