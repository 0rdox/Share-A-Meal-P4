var express = require('express');
var router = express.Router();

/* POST user registration. */
router.get('/', function(req, res, next) {
    res.send('This is your profile');
});


module.exports = router;