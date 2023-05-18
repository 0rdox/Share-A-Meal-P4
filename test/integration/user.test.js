const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const should = chai.should();

const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../../utils/utils').jwtSecretKey;
//testing

//TODO:
//TC-201 - Done
//TC-202 - Done
//TC-203 - Done
//TC-204 - Done
//TC-205 - Done
//TC-206 - Done

//USE ClearDB's + Insert Data functions --> BeforeEach
//rebuild database



//USER TESTCASES
describe('TC-20x - User', () => {
    //TESTCASE 201 -------------------------------------------------------------------------------------------------
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
        it('TC-201-2-1 Niet-valide emailadres', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAdress: '@hotmail.com'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-201-2-2 Niet-valide emailadres', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAdress: ''
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-201-2-3 Niet-valide emailadres', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAdress: 'john@.com'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-201-3-1 Niet-valide wachtwoorden', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAdress: 'j.dewitt@hotmail.com',
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
        it('TC-201-3-2 Niet-valide wachtwoorden', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jacob',
                    lastName: 'DeWitt',
                    emailAdress: 'j.dewitt@hotmail.com',
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
        it.skip('TC-201-4 Gebruiker bestaat al', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'Mariëtte',
                    lastName: 'van den Dullemen',
                    emailAdress: 'm.vandullemen@server.nl',
                    phoneNumber: '06 12345678',
                    password: 'Pass1231Pa'
                })
                .end((err, res) => {
                    res.body.should.have.status(403);
                    res.body.should.have.property('message').to.equal(`User with email m.vandullemen@server.nl already exists.`);
                    res.body.should.have.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {

            chai.request(server)
                .post('/api/user')
                .send({
                    id: '18',
                    firstName: 'Mike',
                    lastName: 'Peters',
                    street: '123 Main St',
                    city: 'Anytown',
                    emailAdress: 'm.peters@avans.nl',
                    phoneNumber: '06 51231234',
                    password: 'Password1234'
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status', 201);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.not.be.empty;
                    let { user } = res.body.data;
                    user.firstName.should.be.a('string').to.be.equal('Mike');
                    user.lastName.should.be.a('string').to.be.equal('Peters');
                    user.emailAdress.should.be.a('string').to.be.equal('m.peters@avans.nl');
                    done();
                });
        });
    });

    //TESTCASE 202 -------------------------------------------------------------------------------------------------
    describe('TC-202 Opvragen van overzicht users', () => {
        it('TC-202-1 Opvragen van overzicht users', (done) => {
            chai.request(server)
                .get('/api/user')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {

                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    res.should.have.status(200);
                    done();
                });
        });
        it('TC-202-2-1 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
            chai.request(server)
                .get('/api/user?fakeFilter=fake')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.property('data').that.is.empty;
                    res.should.have.status(200);
                    done();
                });


        });
        it('TC-202-2-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
            chai.request(server)
                .get('/api/user?awodiajwodiawjd=aoiwdjoaiwd')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.property('data').that.is.empty;
                    done();
                });
        });
        it.skip('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=false', (done) => {
            chai.request(server)
                .get('/api/user?isActive=false')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    // const filteredUser = res.body.data[0];
                    // filteredUser.firstName.should.equal('Gijs');
                    // filteredUser.lastName.should.equal('Ernst');
                    done();
                });
        });
        it('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=true', (done) => {
            chai.request(server)
                .get('/api/user?isActive=true')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.firstName.should.equal('Mariëtte');
                    filteredUser.lastName.should.equal('van den Dullemen');
                    done();
                });

        });
        it('TC-202-5-1 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
            chai.request(server)
                .get('/api/user?password=secret&isActive=true')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.firstName.should.equal('Mariëtte');
                    filteredUser.lastName.should.equal('van den Dullemen');
                    filteredUser.isActive.should.equal(1);
                    filteredUser.password.should.equal('secret');

                    const filteredUser2 = res.body.data[1];
                    filteredUser2.isActive.should.equal(1);
                    filteredUser2.password.should.equal('secret');
                    done();
                });

        });
        it.skip('TC-202-5-2 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
            chai.request(server)
                .get('/api/user?firstName=John')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.firstName.should.equal('John');

                    const filteredUser2 = res.body.data[1];
                    filteredUser2.firstName.should.equal('John');

                    done();
                });

        });
    });

    //TESTCASE 203 -------------------------------------------------------------------------------------------------
    describe('TC-203 Opvragen van gebruikersprofiel', () => {
        it('TC-203-1 Ongeldig token', (done) => {
            chai.request(server)
                .get('/api/user/profile')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-203-2 Gebruiker is ingelogd met geldig token', (done) => {
            chai.request(server)
                .get('/api/user/profile')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('object');
                    const filteredUser = res.body.data;
                    filteredUser.firstName.should.equal('Mariëtte');
                    filteredUser.lastName.should.equal('van den Dullemen');
                    done(); // Call done() to signal the completion of the test case
                });
        });

    });

    //TESTCASE 204 -------------------------------------------------------------------------------------------------
    describe('TC-204 Opvragen van usergegevens bij ID', () => {
        it('TC-204-1 Ongeldig token', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    done();
                });
        });
        it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
            chai.request(server)
                .get('/api/user/99292818128')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 18 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(404)
                    res.body.should.has.property('status').that.equals(404)
                    res.body.should.has.property('data').to.be.empty;
                    res.body.should.has.property('message').that.equals('User with ID 99292818128 not found')
                    done();
                });
        });
        it('TC-204-3-1 Gebruiker-ID bestaat', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('object');
                    const filteredUser = res.body.data;
                    filteredUser.firstName.should.equal('Mariëtte');
                    done();
                });
        });
        it('TC-204-3-2 Gebruiker-ID bestaat', (done) => {
            chai.request(server)
                .get('/api/user/2')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 2 }, jwtSecretKey))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('object');
                    const filteredUser = res.body.data;
                    filteredUser.firstName.should.equal('John');
                    done();

                });
        });
    });

    //TESTCASE 205 -------------------------------------------------------------------------------------------------
    describe('TC-205 Updaten van usergegevens', () => {
        it('TC-205-1 Verplicht veld "emailAddress" ontbreekt', (done) => {
            chai.request(server)
                .put('/api/user/5')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 5 }, jwtSecretKey))
                .send({
                    firstName: 'Jacob',
                    lastName: 'Edwards',
                    isActive: 1,
                    password: "Password1234",
                    phoneNumber: "05 90411019",
                    street: "Street",
                    city: "Anytown"
                })
                .end((err, res) => {
                    res.body.should.have.status(400)
                    res.body.should.has.property('message')
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
            chai.request(server)
                .put('/api/user/5')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 123 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(403)
                    res.body.should.has.property('message')
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-205-3 Niet-valide telefoonnummer', (done) => {
            chai.request(server)
                .put('/api/user/5')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 5 }, jwtSecretKey))
                .send({
                    firstName: 'Jacob',
                    lastName: 'Edwards',
                    isActive: 1,
                    emailAdress: 'j.edwards@server.com',
                    password: "Password1234",
                    phoneNumber: "0519",
                    street: "Street",
                    city: "Anytown"
                })
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-4 Gebruiker bestaat niet', (done) => {
            chai.request(server)
                .put('/api/user/8787587587587758')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 8787587587587758 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(404)
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-205-5 Niet ingelogd', (done) => {
            chai.request(server)
                .put('/api/user/1')
                .end((err, res) => {
                    res.body.should.have.status(401)
                    done();
                });
        });
        it('TC-205-6 Gebruiker-ID bestaat', (done) => {
            //Dit kan veranderd worden door de database te clearen en iets toe te voegen en die updaten, maar voor nu werkt dit.
            //GET USER 5
            chai.request(server)
                .get('/api/user/5')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 5 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('object');
                    const notUpdatedUser = res.body.data;
                    notUpdatedUser.should.have.property('firstName').to.be.equal('Henk');

                    //UPDATE USER 5
                    chai.request(server)
                        .put('/api/user/5')
                        .set('Authorization', 'Bearer ' + jwt.sign({ userid: 5 }, jwtSecretKey))
                        .send({
                            firstName: "Henkie",
                            lastName: "Tankie",
                            isActive: 1,
                            emailAdress: "h.tankie@server.com",
                            password: "secret",
                            phoneNumber: "06 12425495",
                            roles: "editor,guest",
                            street: "",
                            city: ""
                        })
                        .end((err, res) => {
                            res.body.should.have.status(200);
                            const updatedUser = res.body.data;
                            updatedUser.should.have.property('firstName').to.be.equal('Henkie')
                            updatedUser.should.have.property('emailAdress').to.be.equal('h.tankie@server.com')
                                //RETURN USER 5 TO DEFAULT VALUE
                            chai.request(server)
                                .put('/api/user/5')
                                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 5 }, jwtSecretKey))
                                .send({
                                    firstName: "Henk",
                                    lastName: "Tank",
                                    isActive: 1,
                                    emailAdress: "h.tank@server.com",
                                    password: "secret",
                                    phoneNumber: "06 12425495",
                                    roles: "editor,guest",
                                    street: "",
                                    city: ""
                                })
                                .end((err, res) => {
                                    done();
                                })

                        });


                });

            //after test finished, reset to old data?
        });
    });

    //TESTCASE 206 -------------------------------------------------------------------------------------------------
    describe('TC-206 Verwijderen van user', () => {
        it('TC-206-1 Gebruiker bestaat niet', (done) => {
            chai.request(server)
                .delete('/api/user/99292818128')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 99292818128 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(404)
                    res.body.should.has.property('status').that.equals(404)
                    res.body.should.has.property('data').to.be.empty;
                    res.body.should.has.property('message').that.equals('User with ID 99292818128 not found')
                    done();
                });
        });
        it('TC-206-2 Gebruiker is niet ingelogd', (done) => {
            chai.request(server)
                .delete('/api/user/1')
                .end((err, res) => {
                    res.body.should.have.status(401)
                    done();
                });
        });
        it('TC-206-3 De gebruiker is niet de eigenaar van de data', (done) => {
            chai.request(server)
                .delete('/api/user/5')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 12 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(403)
                    res.body.should.has.property('message')
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
            chai.request(server)
                .delete('/api/user/18')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 18 }, jwtSecretKey))
                .end((err, res) => {
                    //Deletes user
                    res.should.have.status(200);
                    res.body.should.have.property('message').to.be.equal('User with ID 18 has been deleted')
                    res.body.should.has.property('data');
                    //Checks if user has been deleted
                    chai.request(server)
                        .get('/api/user/18')
                        .set('Authorization', 'Bearer ' + jwt.sign({ userid: 18 }, jwtSecretKey))
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.has.property('data').to.be.empty;
                            done();
                        });
                });
        });
    });
});