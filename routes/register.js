var express = require('express');
var router = express.Router();

/* POST user registration. */
router.get('/', function(req, res, next) {
    res.send('Register a user here');
});
//HARDCODE -- add user to arraylist?

module.exports = router;