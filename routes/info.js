var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    //STATUSCODE
    res.status(200).json({
        status: 200,
        message: 'Server info-endpoint',
        data: {
            studentName: 'John Gwent',
            studentNumber: 719838,
            description: 'Testing description'
        }
    });
});

module.exports = router;