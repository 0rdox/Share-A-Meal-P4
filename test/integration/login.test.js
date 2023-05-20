const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const should = chai.should();



const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../../utils/utils').jwtSecretKey;

describe('TC-10x - Login', () => {
    describe('TC-101 - Inloggen', (done) => {
        it('TC-101-1 Verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    password: "secret"
                })
                .end((err, res) => {
                    res.body.should.have.status(400)
                    res.body.should.have.property('data').to.be.empty
                    done();
                });
        });
        it('TC-101-2 Niet-valide wachtwoord', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: "j.doe@server.com",
                    password: "secreawdawdawdt"
                })
                .end((err, res) => {
                    res.body.should.have.status(400)
                    res.body.should.have.property('message').to.be.equal("Email or password incorrect")
                    done();
                });
        });
        it('TC-101-3 Gebruiker bestaat niet', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: "k.morrororoij@server.com",
                    password: "secret"
                })
                .end((err, res) => {
                    res.body.should.have.status(404)
                    res.body.should.have.property('message')
                    res.body.should.have.property('data').to.be.empty
                    done();
                });
        });
        it('TC-101-4 Gebruiker succesvol ingelogd', (done) => {
            chai.request(server)
                .post('/api/login')
                .send({
                    emailAdress: "j.doe@server.com",
                    password: "secret"
                })
                .end((err, res) => {
                    res.body.should.have.status(200)
                    res.body.should.have.property('message')
                    res.body.should.have.property('data')
                    const data = res.body.data;
                    data.should.have.property('id').to.be.equal(2)
                    data.should.have.property('token')

                    done();
                });
        });
    });
});