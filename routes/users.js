var express = require('express');
const createHttpError = require('http-errors');
var router = express.Router();

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
    const testUser = {
        id: index,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        street: req.body.street,
        city: req.body.city,
        password: req.body.password,
        emailAddress: req.body.emailAddress,
    }

    console.log("Adding user");
    console.log("User added");
    results.push(testUser);

    //STATUS  CHECK IF STATUS IS 200 OR 201 --> UPDATE IN TEST
    res.status(200).json({
        status: 200,
        message: 'User added',
        data: testUser,
    })
    index++;
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

module.exports = router;