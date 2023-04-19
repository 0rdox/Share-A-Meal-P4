const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.should();
chai.use(chaiHttp);

//TESTEN MOETEN DIEP, ALLEEN PROPERTY TESTEN IS NIET GENOEG (HET KAN VERKEERDE DATA HEBBEN)
//

//TESTCASE
describe('Server-info', function() {
    //done IS CALLBACK --> SIGNALS END OF TEST
    it('TC-102 - Server info', (done) => {
        //GETTING SERVER
        chai.request(server)
            .get('/api/info')
            .end((err, res) => {
                //SHOULD BE OBJECT
                res.body.should.be.an('object');
                //SHOULD HAVE PROPERTY 'status' equal to 200
                res.body.should.has.property('status').to.be.equal(200);
                //SOMS WORDT ER VERTELD WAT DE MESSAGE MOET ZIJN --> MISSCHIEN .to.be.equal TOEVOEGEN
                res.body.should.has.property('message');
                //SHOULD HAVE PROPERTY 'data'
                res.body.should.has.property('data');
                //TEST CONTENTS OF DATA
                let { data, message } = res.body;
                data.should.be.an('object');
                data.should.has.property('studentName').to.be.equal('John Gwent');
                data.should.has.property('studentNumber').to.be.equal(719838);
                done();
            });
    });
});