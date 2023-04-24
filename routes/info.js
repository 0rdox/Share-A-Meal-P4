var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    //STATUSCODE
    res.status(200).json({
        status: 200,
        message: 'Server info-endpoint',
        data: {
            studentName: 'Janko Seremak',
            studentNumber: 2191216,
            description: 'Testing description'
        }
    });
});

module.exports = router;