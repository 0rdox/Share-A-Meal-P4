const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const should = chai.should();

const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../../utils/utils').jwtSecretKey;

describe('TC-40x - Signup ', function() {
    it('TC-40x', (done) => {
        chai.request(server)
            .get('/api/info')
            .end((err, res) => {
                done();
            });
    });
});