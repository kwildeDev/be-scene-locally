const db = require('../db/connection.js');
const request = require('supertest');
const app = require('../src/app.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateExpiredToken = require('./utils/auth-utils.js');
require('dotenv').config({ path: '../.env.test'});

describe('/api/users/me', () => {
    let validToken;
    let testUser;
    const testEmail = 'curry.sauce@fishandchips.com';
    const testPassword = 'mushypeas';
    let hashedPassword;
    afterAll(() => {
        return db.query('DELETE FROM users WHERE email = $1', [testEmail]);
    });
    test('GET 200: returns the logged-in user object when given a valid token', () => {
        return bcrypt.hash(testPassword, 10)
            .then((hash) => {
                hashedPassword = hash;
                return db
                .query('INSERT INTO users (email, password_hash, first_name, last_name, role, organisation_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
                    [testEmail, hashedPassword, 'Chippy', 'Dinner', 'organiser', 2]
                );
            })
            .then((createUserResult) => {
                testUser = createUserResult.rows[0];
                return request(app)
                    .post('/api/auth/login')
                    .send({ email: testEmail, password: testPassword });
            })
            .then((loginResponse) => {
                validToken = loginResponse.body.token;
                return request(app)
                    .get(`/api/users/me`)
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect(200)
            })
            .then(({ body }) => {
                expect(body.user.user_id).toBe(testUser.user_id)
                expect(body.user.email).toBe(testEmail);
                expect(body.user.first_name).toBe('Chippy');
                expect(body.user.last_name).toBe('Dinner');
                expect(body.user.role).toBe('organiser');
                expect(body.user.organisation_id).toBe(2);
                expect(body.user.organisation_name).toBe('Keswick Toddler Time');
            });
    });
    test('GET 401: responds with an error if no token is provided', () => {
        return request(app)
            .get('/api/users/me')
            .expect(401)
            .then(({ body }) => {
                expect(body.msg).toBe('Unauthorised - No Token Provided');
            });
    });
    test('GET 401: responds with an error if an invalid token format is provided (missing `Bearer ${ }`)', () => {
        return request(app)
            .get('/api/users/me')
            .set('Authorization', validToken)
            .expect(401)
            .then(({ body }) => {
                expect(body.msg).toBe('Unauthorised - Invalid Token Format');
            });
    });
    test('GET 401: responds with an error if an invalid bearer token is provided', () => {
        const invalidToken = 'cod.and.chips.with.curry.sauce.and.mushy.peas';
        return request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(401)
            .then(({ body }) => {
                expect(body.msg).toBe('Unauthorised - Invalid Token');
            });
    });
    test('GET 401: responds with an error if an expired token is provided', () => {
        return bcrypt.hash(testPassword, 10)
            .then((hash) => {
                hashedPassword = hash;
                return db
                .query('INSERT INTO users (email, password_hash, first_name, last_name, role, organisation_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
                    [testEmail, hashedPassword, 'Chippy', 'Dinner', 'organiser', 2]
                );
            })
            .then((createUserResult) => {
                testUser = createUserResult.rows[0];
                const expiredToken = generateExpiredToken(testUser);
                return request(app)
                    .get('/api/users/me')
                    .set('Authorization', `Bearer ${expiredToken}`)
                    .expect(401)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Token Expired');
                    });
            });
    });
});