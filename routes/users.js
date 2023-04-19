var express = require('express');
var router = express.Router();



//HARDCODE list of users
//const = can't update/delete
var results = [{
    id: 0,
    firstname: "John",
    lastname: "Evans",
    street: "Lovendijkstraat 61",
    city: "breda",
    isActive: true,
    emailAdress: "j.evans@server.com",
    phoneNumber: "06 12425475"
}, {
    id: 1,
    firstname: "Dave",
    lastname: "Peters",
    street: "Hogeschoollaan 32",
    city: "breda",
    isActive: true,
    emailAdress: "d.peters@server.com",
    phoneNumber: "06 29481919"
}, {
    id: 2,
    firstname: "Elliot",
    lastname: "Garm",
    street: "Hogeschoollaan 32",
    city: "breda",
    isActive: true,
    emailAdress: "d.peters@server.com",
    phoneNumber: "06 29481919"
}]





//GET ALL USERS
router.get('/', function(req, res, next) {
    res.json(results);
});

//GET USERS BY FILTERS
router.get('/', function(req, res, next) {
    //
})



//GET USER BY USERID
router.get('/:userid', function(req, res, next) {
    const userId = parseInt(req.params.userid);
    const user = results.find(user => user.id === userId);
    if (!user) {
        res.status(404).send('User not found.')
    } else {
        res.json(user);
    }
})

//UPDATE USER BY USERID
router.put('')
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