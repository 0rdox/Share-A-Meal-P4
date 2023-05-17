const jwt = require('jsonwebtoken')
    // const jwtSecretKey = require('/utils/utils');

const jwtSecretKey = "iuqhwdiuqhwdiu"


jwt.sign({ foo: 'bar' }, jwtSecretKey, function(err, token) {
    if (err) console.log(err);
    if (token) console.log(token);
});