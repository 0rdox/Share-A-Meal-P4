    const assert = require('assert');
    const pool = require('../utils/mysql-db');
    const jwt = require('jsonwebtoken')
    const jwtSecretKey = require('../utils/utils').jwtSecretKey;

    const authController = {
        login: (req, res, next) => {
            let { emailAdress, password } = req.body
            if (!emailAdress || !password) {
                return res.status(400).json({
                    status: 400,
                    message: 'Missing EmailAddress or Password',
                    data: {}
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
                                status: 409,
                                message: err.message,
                                data: {}
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
                                        return res.status(200).json({
                                            status: 200,
                                            message: "Succesfully logged in",
                                            data: {...results[0], token }
                                        })
                                    };
                                });

                            } else {
                                return res.status(400).json({
                                    status: 400,
                                    message: 'Email or password incorrect',
                                    data: {}
                                })
                            }
                        } else {
                            res.status(404).json({
                                status: 404,
                                message: `User with email: ${emailAdress} not found`,
                                data: {}
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

                return res.status(401).json({
                    status: 401,
                    message: 'Authorization header missing!',
                    data: {}
                });
            }

            // Remove 'Bearer'
            const token = authHeader.substring(7, authHeader.length);

            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {

                    return res.status(401).json({
                        status: 401,
                        message: err.message,
                        data: {}
                    });
                }

                if (!payload) {
                    return res.status(401).json({
                        status: 401,
                        message: 'Invalid token',
                        data: {}
                    });
                }

                req.userId = payload.userid;
                req.emailAdress = payload.emailAdress;
                req.password = payload.password;
                next();
            });
        }

    }


    module.exports = authController