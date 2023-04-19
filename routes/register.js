var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        street: req.body.street,
        city: req.body.city,
        password: req.body.password,
        emailAdress: req.body.emailAdress,
    };
    console.log("User added " + firstName + " " + lastName);
    res.end(JSON.stringify(newUser));
})



module.exports = router;