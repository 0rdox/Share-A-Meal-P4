const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const should = chai.should();

const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../../utils/utils').jwtSecretKey;


//TODO
//TC-302 tests maken
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
        it.only('TC-301-3 Maaltijd succesvol toegevoegd', (done) => {
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
                    if (err) {
                        console.log(err); // Log the error for debugging purposes
                        done(err); // Pass the error to the test runner
                        return;
                    }
                    console.log(res.body)
                    res.body.should.has.status(201);
                    res.body.should.has.property('message');
                    res.body.should.has.property('data')
                    done();
                });
        })


    })
    describe('TC-302 Wijzigen van maaltijdgegevens', () => {
        it('TC-302-1-1 Verplicht velden “name” en/of “price” en/of “maxAmountOfParticipants” ontbreken', (done) => {
            chai.request(server)
                .put('/api/meal/2')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 2 }, jwtSecretKey))
                .send({
                    name: "Hamburger",
                    price: "12.95"
                        //Missing maxAmountOfParticipants
                })
                .end((err, res) => {
                    res.body.should.have.status(400)
                    res.body.should.have.property('message').to.be.equal('Name, price, and maxAmountOfParticipants are required')
                    done();
                });
        })
        it('TC-302-1-2 Verplicht velden “name” en/of “price” en/of “maxAmountOfParticipants” ontbreken', (done) => {
            chai.request(server)
                .put('/api/meal/2')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 2 }, jwtSecretKey))
                .send({
                    //Missing name                    
                    price: "12.95",
                    maxAmountOfParticipants: 4
                })
                .end((err, res) => {
                    res.body.should.have.status(400)
                    res.body.should.have.property('message').to.be.equal('Name, price, and maxAmountOfParticipants are required')
                    res.body.should.have.property('data').to.be.empty
                    done();
                });
        })
        it('TC-302-2 Niet ingelogd', (done) => {
            chai.request(server)
                .put('/api/meal/2')
                .send({})
                .end((err, res) => {
                    res.body.should.have.status(401)
                    res.body.should.have.property('message').to.be.equal('Authorization header missing!')
                    done();
                });
        })
        it('TC-302-3 Niet de eigenaar van de data', (done) => {
            chai.request(server)
                .put('/api/meal/2')
                .send({})
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(403)
                    res.body.should.have.property('message').to.be.equal('User is not the owner of this data')
                    done();
                });
        })
        it('TC-302-4 Maaltijd bestaat niet', (done) => {
            chai.request(server)
                .put('/api/meal/4123123123')
                .send({})
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(404)
                    res.body.should.have.property('message').to.be.equal('Meal with id 4123123123 not found')
                    done();
                });
        })
        it('TC-302-5 Maaltijd succesvol gewijzigd', (done) => {
            chai.request(server)
                .get('/api/meal/5')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 3 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(200);
                    res.body.should.have.property('data').that.is.an('object');
                    const meal = res.body.data;

                    meal.should.have.property('name').to.be.equal('Groentenschotel uit de oven');

                    //UPDATE MEAL 5
                    chai.request(server)
                        .put('/api/meal/5')
                        .set('Authorization', 'Bearer ' + jwt.sign({ userid: 3 }, jwtSecretKey))
                        .send({
                            name: "Hamburger",
                            maxAmountOfParticipants: 6,
                            price: "6.75"
                        })
                        .end((err, res) => {
                            res.body.should.have.status(200);
                            const meal2 = res.body.data;
                            meal2.should.have.property('name').to.be.equal('Hamburger')

                            //RETURN MEAL 5 TO DEFAULT VALUE
                            chai.request(server)
                                .put('/api/meal/5')
                                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 3 }, jwtSecretKey))
                                .send({
                                    name: "Groentenschotel uit de oven",
                                    maxAmountOfParticipants: 6,
                                    price: "6.75"
                                })
                                .end((err, res) => {
                                    done();
                                })

                        });


                })
        })
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
                .delete('/api/meal/1')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 999 }, jwtSecretKey))
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
        it.only('TC-305-4 Maaltijd succesvol verwijderd', (done) => {
            chai.request(server)
                .delete('/api/meal/21')
                .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                .end((err, res) => {
                    res.body.should.have.status(200)
                    chai.request(server)
                        .get('/api/meal/21')
                        .set('Authorization', 'Bearer ' + jwt.sign({ userid: 1 }, jwtSecretKey))
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.has.property('data').to.be.empty;
                            done();
                        });
                });
        })
    })


})