const testData = require('../db/data/test-data/index-test.js');
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const request = require('supertest');
const app = require('../src/app.js');
const endpoints = require('../src/endpoints.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateExpiredToken = require('./utils/auth-utils.js');
require('dotenv').config({ path: '../.env.test'});

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('Full API Test Suite', () => {
    describe('Seeding Tests', () => {
        require('./seeding.test.js');
    });
    describe('API Structure Tests', () => {
        require('./api-structure.test.js');
    });
    describe('Categories and Subcategories Tests', () => {
        require('./categories.test.js');
    });
    describe('Events and Attendees Tests', () => {
        require('./events.test.js');
    });
    describe('Users Tests', () => {
        require('./users.test.js');
    });
    describe('Venues Tests', () => {
        require('./venues.test.js');
    });
    describe('Organisations Tests', () => {
        require('./organisations.test.js');
    });
});

