// const assert = require('assert');
// const jwt = require('jsonwebtoken');
// const pool = require('../utils/mysql-db');
// const { jwtSecretKey } = require('../utils/utils');

// const authController = {
//     /**
//      * login
//      * Retourneer een geldig token indien succesvol
//      */
//     login(req, res, next) {
//         let { emailAdress, password } = req.body
//         if (!emailAdress || !password) {
//             next({
//                 code: 404,
//                 message: 'Verplicht velt ontbreekt',
//             })
//         }

//         pool.getConnection((err, conn) => {
//             if (err) {
//                 next({
//                     code: 500,
//                     message: err.code,
//                 })
//             }

//             if (conn) {
//                 // 1. SQL Select, zie of deze user id in de database bestaat.
//                 //      - Niet gevonden, dan melding Not Authorized
//                 conn.query(
//                     'SELECT * FROM user WHERE emailAdress = ?', [emailAdress],
//                     function(err, results, fields) {
//                         if (err) {
//                             next({
//                                 code: 400,
//                                 message: err.message,
//                             })
//                         }

//                         if (results[0]) {
//                             //  2. Als user gevonden, check dan het password
//                             //      - Geen match, dan melding Not Authorized
//                             if (results[0].password == password) {
//                                 // 3. Maak de payload en stop de userId daar in
//                                 const payload = { id: results[0].id }
//                                     // 4. Genereer het token en stuur deze terug in de response
//                                 jwt.sign(
//                                     payload,
//                                     jwtSecretKey, { expiresIn: '1d' },
//                                     (err, token) => {
//                                         res.status(200).json({
//                                             code: 200,
//                                             message: 'User heeft ingelogd',
//                                             data: {...results[0], token },
//                                         })
//                                     }
//                                 )
//                             } else {
//                                 next({
//                                     code: 400,
//                                     message: 'Emailadress en wachtwoord komen niet overeen',
//                                 })
//                             }
//                         } else {
//                             next({
//                                 code: 404,
//                                 message: `User met emailAdress ${emailAdress} kan niet worden gevonden`,
//                             })
//                         }
//                     }
//                 )
//             }
//         })
//     },
//     /**
//      * Validatie functie voor /api/login,
//      * valideert of de vereiste body aanwezig is.
//      */
//     validateLogin(req, res, next) {
//         // Verify that we receive the expected input
//         try {
//             assert(
//                 typeof req.body.emailAdress === 'string',
//                 'emailAdress must be a string.'
//             );
//             assert(
//                 typeof req.body.password === 'string',
//                 'password must be a string.'
//             );
//             next();
//         } catch (ex) {
//             res.status(422).json({
//                 error: ex.toString(),
//                 datetime: new Date().toISOString()
//             });
//         }
//     },

//     //
//     //
//     //
//     validateToken(req, res, next) {
//         // The headers should contain the authorization-field with value 'Bearer [token]'
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             next({
//                 code: 401,
//                 message: 'Authorization header missing!',
//                 data: undefined
//             });
//         } else {
//             /**
//              * We hebben de headers. Lees het token daaruit, valideer het token
//              * en lees de payload daaruit. De userId uit de payload stop je in de req,
//              * en ga naar de volgende endpoint.
//              * Zie de Ppt van de les over authenticatie voor tips en tricks.
//              */

//             const token = authHeader.substring(7, authHeader.length);


//             //Bij een ander bestand bj profile 
//             jwt.verify(token, jwtSecretKey, (err, payload) => {
//                 if (err) {
//                     next({
//                         code: 401,
//                         message: 'Not authorized',
//                         data: undefined
//                     });
//                 }
//                 if (payload) {
//                     req.userId = payload.userId;
//                     next();
//                 }

//             });
//         }
//     }
// };

// module.exports = authController;