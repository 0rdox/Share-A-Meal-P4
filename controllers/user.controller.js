const assert = require('assert');
const results = require('../utils/database');

const userController = {
    getAllUsers: (req, res) => {
        let filteredResults = results.users;

        const firstName = req.query.firstName;
        const lastName = req.query.lastName;
        const emailAddress = req.query.emailAddress;
        const isActive = req.query.isActive;
        const city = req.query.city;


        // FILTERS
        if (firstName) {
            filteredResults = filteredResults.filter(user => user.firstName.toLowerCase() === firstName.toLowerCase());
        }
        if (lastName) {
            filteredResults = filteredResults.filter(user => user.lastName.toLowerCase() === lastName.toLowerCase());
        }
        if (emailAddress) {
            filteredResults = filteredResults.filter(user => user.emailAddress.toLowerCase() === emailAddress.toLowerCase());
        }
        if (isActive !== undefined) {
            const isActiveBoolean = isActive === "true";
            filteredResults = filteredResults.filter(user => user.isActive === isActiveBoolean);
        }
        if (city) {
            filteredResults = filteredResults.filter(user => user.city.toLowerCase() === city.toLowerCase());
        }

        //IF FILTERS DON'T MATCH, RETURN NOTHING
        if (!firstName && !lastName && !emailAddress && !isActive && !city && Object.keys(req.query).length !== 0) {
            filteredResults = [];
        }
        // RETURN RESULTS
        res.status(200).json({
            status: 200,
            message: 'List of users',
            data: filteredResults,
        });

    },
    createUser: (req, res) => {
        let index = results.users.length;

        const user = {
            id: index + 1,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            street: req.body.street,
            city: req.body.city,
            isActive: req.body.isActive === undefined ? true : req.body.isActive,
            emailAddress: req.body.emailAddress,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
        }

        //CHECK IF USER EXISTS
        const userExists = results.users.some(u => u.emailAddress === user.emailAddress);
        if (userExists) {
            res.status(403).json({
                status: 403,
                message: `User with Email-Address ${user.emailAddress} already exists`,
                data: {},
            });
            return;
        }

        //ASSERT
        try {
            assert(typeof user.firstName === 'string' && user.firstName.trim() !== '', 'First name must be a non-empty string');
            assert(typeof user.lastName === 'string' && user.lastName.trim() !== '', 'Last name must be a non-empty string');
            assert(typeof user.emailAddress === 'string' && validateEmail(user.emailAddress), 'Email Address must be a valid emailaddress');
            assert(typeof user.password === 'string' && validatePassword(user.password), 'Password must be a valid password')
            assert(typeof user.phoneNumber === 'string' && validatePhoneNumber(user.phoneNumber), 'Phone number must be a valid phone number');
        } catch (err) {
            //STATUS ERROR
            res.status(400).json({
                status: 400,
                message: err.message.toString(),
                data: {},
            });
            return;
        }

        //     //ADD EMAIL & PASSWORD COMBO TO HASHMAP
        //     passwordMap[req.body.emailAddress] = req.body.password;
        //     //SAVE USER IN RESULTS
        //     results.users.push(user);
        //     //DELETE PASSWORD FROM RESULTS
        //     results.users.map(user => {
        //         if (user.password) {
        //             delete user.password;
        //         }
        //     });

        //ADD USER TO USERS DATABASE
        results.users.push(user);



        //SUCCESS
        res.status(201).json({
            status: 201,
            message: `User with Email-Address ${user.emailAddress} has been created`,
            data: { user },
        });
    },
    getProfile: (req, res) => {
        res.status(200).json({
            status: 200,
            message: 'Your profile',
            data: {
                id: 1,
                firstName: "John",
                lastName: "Evans",
                street: "Lovendijkstraat 61",
                city: "Breda",
                isActive: true,
                emailAddress: "j.evans@server.com",
                phoneNumber: "061-242-5475"
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
    getUserId: (req, res) => {
        const userId = parseInt(req.params.userid);
        const user = results.users.find(user => user.id === userId);
        if (!user) {
            res.status(404).json({
                status: 404,
                message: `User with ID ${userId} not found`,
                data: []
            });
        } else {
            res.status(200).json({
                status: 200,
                message: `User met ID ${userId} found`,
                data: user,
            });
        }
    },
    updateUserId: (req, res) => {
        const userId = parseInt(req.params.userid);
        const user2 = results.users.find(user => user.id === userId);
        if (!user2) {
            res.status(404).json({
                status: 404,
                message: `User with ID ${userId} not found`,
                data: []
            });
        }

        //GET USER
        const user = results.users[userId - 1];

        //ASSERTIONS
        try {
            assert(typeof req.body.firstName === 'undefined' || (typeof req.body.firstName === 'string' && req.body.firstName.trim() !== ''), 'First name must be a non-empty string');
            assert(typeof req.body.lastName === 'undefined' || (typeof req.body.lastName === 'string' && req.body.lastName.trim() !== ''), 'Last name must be a non-empty string');
            assert(typeof req.body.emailAddress === 'undefined' || (typeof req.body.emailAddress === 'string' && validateEmail(req.body.emailAddress)), 'Email Address must be a valid email address');
            assert(typeof req.body.phoneNumber === 'undefined' || (typeof req.body.phoneNumber === 'string' && validatePhoneNumber(req.body.phoneNumber)), 'Phone number must be a valid phone number');
        } catch (err) {
            res.status(400).json({
                status: 400,
                message: err.message.toString(),
                data: {},
            });
            return;
        }
        //UPDATE USER
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.street = req.body.street || user.street;
        user.city = req.body.city || user.city;
        user.isActive = req.body.isActive === undefined ? user.isActive : req.body.isActive;
        user.emailAddress = req.body.emailAddress || user.emailAddress;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

        // //DELETE PASSWORD FROM RESULTS
        // results.map(user => {
        //     if (user.password) {
        //         delete user.password;
        //     }
        // });

        res.status(200).json({
            status: 200,
            message: `User met ID ${userId} has been updated`,
            data: user
        });
    },
    deleteUserId: (req, res) => {
        const userId = parseInt(req.params.userid);
        const user = results.users.filter(user => user.id === userId);
        if (user.length === 0) {
            res.status(404).json({
                status: 404,
                message: `User with ID ${userId} not found`,
                data: {}
            })
        } else {
            results.users = results.users.filter(user => user.id !== userId);
            res.status(200).json({
                status: 200,
                message: `User with ID ${userId} has been deleted`,
                data: {}
            });
            return;
        }
    }
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
    const regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    return regex.test(phoneNumber);
}

module.exports = userController;