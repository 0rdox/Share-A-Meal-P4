var express = require('express');
var router = express.Router();

//Er komt een verzoek binnen om een gebruiker in te loggen. 
//2. Het systeem valideert de inkomende gegevens op compleetheid. 
//3. Het systeem zoekt de gegevens van de gebruiker op. 
//4. Het systeem valideert of het opgegeven wachtwoord overeenkomt met dat van de gevonden gebruiker. 
//5. Het systeem genereert een nieuw token. 
//6. Het systeem stuurt een antwoordbericht terug, met daarin de gegevens van de gebruiker, en het gegenereerde token, 
//xzonder zijn wachtwoord mee te sturen.


/* POST user registration. */
router.get('/login', function(req, res, next) {
    res.send('Login Here');
});


module.exports = router;