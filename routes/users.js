var express = require('express');
const createHttpError = require('http-errors');
var router = express.Router();
const assert = require('assert');
router.use(express.json());

var passwordMap = {};
passwordMap['j.evans@server.com'] = 'Eendenbeker12';
passwordMap['g.ernst@server.com'] = 'Gijskoektrommel1';
passwordMap['e.garm@server.com'] = '123PASS123';



//HARDCODE list of users (In Memory Database)
var results = [{
    id: 1,
    firstName: "John",
    lastName: "Evans",
    street: "Lovendijkstraat 61",
    city: "breda",
    isActive: true,
    emailAddress: "j.evans@server.com",
    phoneNumber: "06 12425475"
}, {
    id: 2,
    firstName: "Gijs",
    lastName: "Ernst",
    street: "sacrementsstraat 1",
    city: "Leeuwarden",
    isActive: true,
    emailAddress: "g.ernst@server.com",
    phoneNumber: "06 29481919"
}, {
    id: 3,
    firstName: "Elliot",
    lastName: "Garm",
    street: "Hogeschoollaan 32",
    city: "breda",
    isActive: true,
    emailAddress: "e.garm@server.com",
    phoneNumber: "06 29481919"
}, ]


//GET ALL USERS
router.get('/', function(req, res, next) {
    let filteredResults = results;

    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const emailAddress = req.query.emailAddress;
    const isActive = req.query.isActive;

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

    //IF FILTERS DON'T MATCH, RETURN NOTHING
    if (!firstName && !lastName && !emailAddress && !isActive && Object.keys(req.query).length !== 0) {
        filteredResults = [];
    }
    // RETURN RESULTS
    res.status(200).json({
        data: filteredResults,
    });
});


let index = results.length;
//REGISTER USER
router.post('/', (req, res) => {
    //USER
    const user = {
            id: index++,
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
    const userExists = results.some(u => u.emailAddress === user.emailAddress);
    if (userExists) {
        res.status(403).json({
            status: 403,
            message: 'User with this email address already exists',
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
    } catch (err) {
        //STATUS ERROR
        res.status(400).json({
            status: 400,
            message: err.message.toString(),
            data: {},
        });
        return;
    }

    //ADD EMAIL & PASSWORD COMBO TO HASHMAP
    passwordMap[req.body.emailAddress] = req.body.password;
    //SAVE USER IN RESULTS
    results.push(user);

    //DELETE PASSWORD FROM RESULTS
    results.map(user => {
        if (user.password) {
            delete user.password;
        }
    });

    //STATUS SUCCEEDED
    res.status(201).json({
        status: 201,
        message: 'User added',
        data: user,
    })
    res.end();
})



//GET USER BY USERID
router.get('/:userid', function(req, res, next) {
    const userId = parseInt(req.params.userid);
    const user = results.find(user => user.id === userId);
    if (!user) {
        next(createHttpError(404));
    } else {
        res.json(user);
    }
    // if (user = undefined) {
    //     res.status(400).json({
    //         status: 400,
    //         message: 'user not found'
    //     })
    // }
})

//UPDATE USER BY USERID
router.put('/putting')
    //DELETE USER BY USERID
router.delete('/:userid', function(req, res, next) {
    const userId = parseInt(req.params.userid);
    const user = results.filter(user => user.id === userId);
    if (!user) {
        res.status(404).send('User not found.')
    } else {
        //CODE FOR DELETING USER 
        results = results.filter(user => user.id !== userId);
        console.log("User deleted.");
    }
})


//EMAIL VALIDATION
function validateEmail(email) {
    //VALIDATES a.user@hotmail.com
    //VALIDATES user@hotmail.com
    const re = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/;
    return re.test(String(email).toLowerCase());
}


function validatePassword(pass) {
    //ATLEAST 1 NUMBER
    //ATLEAST 1 UPPERCASE
    //MINIMUM LENGTH 8
    const regex = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    return regex.test(pass);
}


module.exports = router;