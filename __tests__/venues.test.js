const db = require('../db/connection.js');
const request = require('supertest');
const app = require('../src/app.js');
const endpoints = require('../src/endpoints.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateExpiredToken = require('./utils/auth-utils.js');
require('dotenv').config({ path: '../.env.test'});

describe('/api/venues', () => {
    test('GET 200: returns an array of all available venues', () => {
        return request(app)
            .get('/api/venues')
            .expect(200)
            .then(({ body }) => {
                expect(body.venues).toHaveLength(10);
                body.venues.forEach((venue) => {
                    expect(venue).toHaveProperty('venue_id', expect.any(Number));
                    expect(venue).toHaveProperty('name', expect.any(String));
                    expect(venue).toHaveProperty('address_line1', expect.any(String));
                    expect(venue).toHaveProperty('address_line2');
                    expect(venue).toHaveProperty('city', expect.any(String));
                    expect(venue).toHaveProperty('county', expect.any(String));
                    expect(venue).toHaveProperty('postcode', expect.any(String));
                });
            });
    });
});