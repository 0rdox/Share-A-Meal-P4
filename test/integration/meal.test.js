const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const should = chai.should();

const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../../utils/utils').jwtSecretKey;

describe('TC-30x - Meal', () => {
    describe('TC-301 Toevoegen van een maaltijd', () => {

    })
    describe('TC-302 Wijzigen van maaltijdgegevens', () => {

    })
    describe('TC-303 Opvragen van alle maaltijden', () => {

    })
    describe('TC-304 Opvragen van maaltijden bij ID', () => {

    })
    describe('TC-305 Verwijderen van maaltijd', () => {

    })


})