const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.should();
chai.use(chaiHttp);

//USER TESTCASES
describe('TC-20x - User', () => {
    //TESTCASE 201
    describe('TC-201 Registreren als nieuwe user', () => {
        it('TC-201-1 Verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    //emailAddress ontbreekt
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        describe('TC-201-2 Niet-valide emailadres', () => {
            it('TC-201-2-1', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        firstName: 'Jacob',
                        lastName: 'DeWitt',
                        emailAddress: '@hotmail.com'
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.has.property('status').to.be.equal(400);
                        res.body.should.has.property('message');
                        res.body.should.has.property('data').to.be.empty;
                        done();
                    });
            });
            it('TC-201-2-2', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        firstName: 'Jacob',
                        lastName: 'DeWitt',
                        emailAddress: ''
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.has.property('status').to.be.equal(400);
                        res.body.should.has.property('message');
                        res.body.should.has.property('data').to.be.empty;
                        done();
                    });
            });
            it('TC-201-2-2', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        firstName: 'Jacob',
                        lastName: 'DeWitt',
                        emailAddress: 'john@.com'
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.has.property('status').to.be.equal(400);
                        res.body.should.has.property('message');
                        res.body.should.has.property('data').to.be.empty;
                        done();
                    });
            });
        });
        describe('TC-201-3 Niet-valide wachtwoorden', () => {
            it('TC-201-3-1', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        firstName: 'Jacob',
                        lastName: 'DeWitt',
                        emailAddress: 'j.dewitt@hotmail.com',
                        password: '123123123'
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.has.property('status').to.be.equal(400);
                        res.body.should.has.property('message');
                        res.body.should.has.property('data').to.be.empty;
                        done();
                    });
            });
            it('TC-201-3-2', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        firstName: 'Jacob',
                        lastName: 'DeWitt',
                        emailAddress: 'j.dewitt@hotmail.com',
                        password: 'Pass123'
                    })
                    .end((err, res) => {
                        res.body.should.be.an('object');
                        res.body.should.has.property('status').to.be.equal(400);
                        res.body.should.has.property('message');
                        res.body.should.has.property('data').to.be.empty;
                        done();
                    });
            });

        });
        it('TC-201-4 Gebruiker bestaat al', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAddress: 'e.garm@server.com',
                    password: 'Pass123'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(403);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
    });
    it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                firstName: 'Derek',
                lastName: 'Peters',
                street: '123 Main St',
                city: 'Anytown',
                emailAddress: 'd.peters@avans.nl',
                phoneNumber: '555-1234',
                password: 'Password1234'
            })
            .end((err, res) => {
                res.body.should.be.an('object');
                res.body.should.has.property('status', 201);
                res.body.should.has.property('message');
                res.body.should.has.property('data').to.not.be.empty;

                let { firstName, lastName, emailAddress } = res.body.data;
                firstName.should.be.a('string').to.be.equal('Derek');
                lastName.should.be.a('string').to.be.equal('Peters');
                emailAddress.should.be.a('string').to.be.equal('d.peters@avans.nl');
                done();
            });
    });
});
//TESTCASE 202
describe('TC-202 ... ...', () => {

});