var express = require('express');
const createHttpError = require('http-errors');
var router = express.Router();
const assert = require('assert');
router.use(express.json());


//HARDCODE list of users (In Memory Database)
var results = [{
    id: 0,
    firstName: "John",
    lastName: "Evans",
    street: "Lovendijkstraat 61",
    city: "breda",
    isActive: true,
    emailAddress: "j.evans@server.com",
    phoneNumber: "06 12425475"
}, {
    id: 1,
    firstName: "Dave",
    lastName: "Peters",
    street: "Hogeschoollaan 32",
    city: "breda",
    isActive: true,
    emailAddress: "d.peters@server.com",
    phoneNumber: "06 29481919"
}, {
    id: 2,
    firstName: "Elliot",
    lastName: "Garm",
    street: "Hogeschoollaan 32",
    city: "breda",
    isActive: true,
    emailAddress: "d.peters@server.com",
    phoneNumber: "06 29481919"
}, ]


//GET ALL USERS
router.get('/', function(req, res, next) {
    res.json(results);
});

//GET USERS BY FILTERS
router.get('/test', function(req, res, next) {
    //
})


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
            isActive: true,
            emailAddress: req.body.emailAddress,
            phoneNumber: req.body.phoneNumber,
        }
        //ASSERT

    try {
        assert(typeof user.firstName === 'string' && user.firstName.trim() !== '', 'firstName must be a non-empty string');
        assert(typeof user.lastName === 'string' && user.lastName.trim() !== '', 'lastName must be a non-empty string');
        assert(typeof user.emailAddress === 'string' && validateEmail(user.emailAddress), 'emailAddress must be a valid emailaddress');
    } catch (err) {
        //STATUS ERROR
        res.status(400).json({
            status: 400,
            message: err.message.toString(),
            data: {},
        });
        return;
    }


    //INCREASE INDEX BY 1 AND PUSH TO DATABASE

    results.push(user);
    //STATUS SUCCEEDED
    res.status(200).json({
        status: 200,
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
    const re = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]{2,}$/;
    console.log(String(email));
    return re.test(String(email).toLowerCase());
}




module.exports = router;