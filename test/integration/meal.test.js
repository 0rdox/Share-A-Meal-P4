const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const should = chai.should();

const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../../utils/utils').jwtSecretKey;

describe('TC-30x - Meal', () => {
    describe('TC-301 Toevoegen van een maaltijd', () => {
        it('TC-301-1 Verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .post('/api/meal')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .send({
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    maxAmountOfParticipants: 2,
                    price: "19.95",
                    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNFe0c3pucAjpExbQmZzmRwfAjKPyHEhzSF-A-B-UbOA&s",
                    cookId: 2,
                    description: "Een heerlijke hamburger! Altijd goed voor tevreden gesmikkel!",
                    allergenes: ""
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(400);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-301-2 Niet ingelogd', (done) => {
            chai.request(server)
                .post('/api/meal')
                .send({
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    maxAmountOfParticipants: 2,
                    price: "19.95",
                    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNFe0c3pucAjpExbQmZzmRwfAjKPyHEhzSF-A-B-UbOA&s",
                    cookId: 2,
                    name: "Hamburger",
                    description: "Een heerlijke hamburger! Altijd goed voor tevreden gesmikkel!",
                    allergenes: ""
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.have.status(401);
                    //res.body.should.has.property('status').to.be.equal(401);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        });
        it('TC-301-3 Maaltijd succesvol toegevoegd', (done) => {
            chai.request(server)
                .post('/api/meal')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .send({
                    id: 21,
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 1,
                    maxAmountOfParticipants: 2,
                    price: "19.95",
                    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNFe0c3pucAjpExbQmZzmRwfAjKPyHEhzSF-A-B-UbOA&s",
                    cookId: 2,
                    name: "Hamburger",
                    description: "Een heerlijke hamburger! Altijd goed voor tevreden gesmikkel!",
                    allergenes: ""
                })
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(201);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data')
                    done();
                });
        })


    })
    describe('TC-302 Wijzigen van maaltijdgegevens', () => {

    })
    describe('TC-303 Opvragen van alle maaltijden', () => {
        it('TC-303-1 Lijst van maaltijden geretourneerd', (done) => {
            chai.request(server)
                .get('/api/meal')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(200);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').that.is.an('array').with.length.gte(2);
                    const firstMeal = res.body.data[0];
                    firstMeal.name.should.equal('Pasta Bolognese met tomaat, spekjes en kaas');
                    done();
                });
        })
    })
    describe('TC-304 Opvragen van maaltijden bij ID', () => {
        it('TC-304-1 Maaltijd bestaat niet', (done) => {
            chai.request(server)
                .get('/api/meal/34567898765456789')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(404);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        })
        it('TC-304-2 Details van maaltijd geretourneerd', (done) => {
            chai.request(server)
                .get('/api/meal/1')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.has.property('status').to.be.equal(200);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data');

                    const firstMeal2 = res.body.data;
                    firstMeal2.name.should.equal('Pasta Bolognese met tomaat, spekjes en kaas');;
                    done();
                });
        })
    })
    describe('TC-305 Verwijderen van maaltijd', () => {
        it('TC-305-1 Niet ingelogd', (done) => {
            chai.request(server)
                .delete('/api/meal/21')
                .end((err, res) => {
                    res.body.should.be.an('object');
                    res.body.should.have.status(401)
                    res.body.should.has.property('message');
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        })
        it('TC-305-2 Niet de eigenaar van de data', (done) => {
            chai.request(server)
                .delete('/api/meal/21')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 18 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(403)
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        })
        it('TC-305-3 Maaltijd bestaat niet', (done) => {
            chai.request(server)
                .delete('/api/meal/213456789654567899876567')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(404)
                    res.body.should.has.property('data').to.be.empty;
                    done();
                });
        })
        it('TC-305-4 Maaltijd succesvol verwijderd', (done) => {
            chai.request(server)
                .delete('/api/meal/21')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(200)
                    chai.request(server)
                        .get('/api/meal/21')
                        .set('Authorization', 'Bearer ' + jwt.sign({ userid: 18 }, jwtSecretKey))
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.has.property('data').to.be.empty;
                            done();
                        });
                });
        })
    })


})