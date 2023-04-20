var express = require('express');
var router = express.Router();


//USE STYLE.CSS
router.use(express.static('public'));

//GET HOMEPAGE
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Share A Meal' });
});


module.exports = router;