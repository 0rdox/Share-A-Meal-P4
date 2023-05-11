const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const should = chai.should();





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


        it('TC-201-4 Gebruiker bestaat al', (done) => {
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
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(403);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
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
                    phoneNumber: '05 51231234',
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
                .end((err, res) => {
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    res.should.have.status(200);
                    done();
                });
        });

        it('TC-202-2-1 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
            chai.request(server)
                .get('/api/user?fakeFilter=fake')
                .end((err, res) => {
                    res.body.should.have.property('data').that.is.empty;
                    res.should.have.status(200);
                    done();
                });


        });
        it('TC-202-2-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
            chai.request(server)
                .get('/api/user?awodiajwodiawjd=aoiwdjoaiwd')
                .end((err, res) => {
                    res.body.should.have.property('data').that.is.empty;
                    done();
                });
        });

        it('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=false', (done) => {
            chai.request(server)
                .get('/api/user?isActive=false')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    // const filteredUser = res.body.data[0];
                    // filteredUser.firstName.should.equal('Gijs');
                    // filteredUser.lastName.should.equal('Ernst');
                    console.log(res.body);
                    done();

                });
        });
        it('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=true', (done) => {
            chai.request(server)
                .get('/api/user?isActive=true')
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
                .get('/api/user?street=Street&isActive=true')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.firstName.should.equal('Roko');
                    filteredUser.lastName.should.equal('Roko');
                    filteredUser.isActive.should.equal(1);
                    filteredUser.street.should.equal('Street');

                    const filteredUser2 = res.body.data[1];
                    filteredUser2.isActive.should.equal(1);
                    filteredUser2.street.should.equal('Street');
                    console.log(res.body);
                    done();
                });

        });
        it('TC-202-5-2 Toon gebruikers met zoektermen op bestaande velden (max op 2 velden filteren)', (done) => {
            chai.request(server)
                .get('/api/user?firstName=John')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('array').with.length.gte(2);
                    const filteredUser = res.body.data[0];
                    filteredUser.firstName.should.equal('John');

                    const filteredUser2 = res.body.data[1];
                    filteredUser2.firstName.should.equal('John');
                    console.log(res.body);

                    done();
                });

        });


    });
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
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('data').that.is.an('object');
                    const filteredUser = res.body.data;
                    filteredUser.firstName.should.equal('John');
                    filteredUser.lastName.should.equal('Evans');
                    filteredUser.city.should.equal('Breda');

                    done();
                });
        });
    });
    describe('TC-204 Opvragen van usergegevens bij ID', () => {
        it('TC-204-1 Ongeldig token', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-204-3-1 Gebruiker-ID bestaat', (done) => {
            chai.request(server)
                .get('/api/user/1')
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
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('object');
                    const filteredUser = res.body.data;
                    filteredUser.firstName.should.equal('John');
                    done();

                });
        });
    });
    describe('TC-205 Updaten van usergegevens', () => {
        it('TC-205-1 Verplicht veld "emailAddress" ontbreekt', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-2 De gebruiker is niet de eigenaar van de data', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-3 Niet-valide telefoonnummer', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-4 Gebruiker bestaat niet', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-5 Niet ingelogd', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-205-6 Gebruiker-ID bestaat', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
    });


    describe('TC-206 Verwijderen van user', () => {
        it('TC-206-1 Gebruiker bestaat niet', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-206-2 Gebruiker is niet ingelogd', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-206-3 De gebruiker is niet de eigenaar van de data', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    done();
                });
        });
        it('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
            chai.request(server)
                .delete('/api/user/18')
                .end((err, res) => {
                    //Deletes user
                    res.should.have.status(200);
                    res.body.should.have.property('message').to.be.equal('User with ID 18 has been deleted')
                    res.body.should.has.property('data');
                    //Checks if user has been deleted
                    chai.request(server)
                        .get('/api/user/18')
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.has.property('data').to.be.empty;
                            done();
                        });
                });
        });
    });
});