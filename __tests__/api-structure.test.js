const request = require('supertest');
const app = require('../src/app.js');
const endpoints = require('../src/endpoints.json');
require('dotenv').config({ path: '../.env.test'});

describe('/api', () => {
    test('GET 200: returns an object detailing all available API endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body.endpoints).toEqual(endpoints);
            });
    });
});

describe('Invalid route handling', () => {
    test('GET 404: responds with an error message when given an invalid endpoint', () => {
        return request(app)
            .get('/api/banana')
            .expect(404)
            .then((response) => {
                expect(response.status).toBe(404);
                expect(response.body.msg).toBe('Endpoint Does Not Exist');
            });
    });
});