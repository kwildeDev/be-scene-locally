const testData = require('../db/data/test-data/index-test.js');
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const request = require('supertest');
//const app = require('../src/app.js');
//const endpoints = require('../src/endpoints.json');
const { string } = require('pg-format');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('Test seeding of test data', () => {
    test('Should correctly seed organisations table', () => {
        return db.query('SELECT * FROM organisations;').then(({ rows }) => {
            expect(rows).toHaveLength(10);
            rows.forEach((row) => {
                expect(row).toHaveProperty('organisation_id', expect.any(Number));
                expect(row).toHaveProperty('name', expect.any(String));
                expect(row).toHaveProperty('description', expect.any(String));
                expect(row).toHaveProperty('logo_url', expect.any(String));
                expect(row).toHaveProperty('website', expect.any(String));
            });
        });
    });
    test('Should correctly seed venues table', () => {
        return db.query('SELECT * FROM venues;').then(({ rows }) => {
            expect(rows).toHaveLength(10);
            rows.forEach((row) => {
                expect(row).toHaveProperty('venue_id', expect.any(Number));
                expect(row).toHaveProperty('name', expect.any(String));
                expect(row).toHaveProperty('address_line1', expect.any(String));
                expect(row).toHaveProperty('address_line2');
                expect(row).toHaveProperty('city', expect.any(String));
                expect(row).toHaveProperty('county', expect.any(String));
                expect(row).toHaveProperty('postcode', expect.any(String));
                expect(row).toHaveProperty('latitude', expect.any(String));
                expect(row).toHaveProperty('longitude', expect.any(String));
            });
        });
    });
    test('Should correctly seed categories table', () => {
        return db.query('SELECT * FROM categories;').then(({ rows }) => {
            expect(rows).toHaveLength(10);
            rows.forEach((row) => {
                expect(row).toHaveProperty('category_id', expect.any(Number));
                expect(row).toHaveProperty('name', expect.any(String));
                expect(row).toHaveProperty('description', expect.any(String));
                expect(row).toHaveProperty('created_at', expect.any(Date));
                expect(row).toHaveProperty('updated_at', expect.any(Date));
            });
        });
    });
    test('Should correctly seed users table', () => {
        return db.query('SELECT * FROM users;').then(({ rows }) => {
            expect(rows).toHaveLength(10)
            rows.forEach((row) => {
                expect(row).toHaveProperty('user_id', expect.any(Number));
                expect(row).toHaveProperty('email', expect.any(String));
                expect(row).toHaveProperty('password_hash', expect.any(String));
                expect(row).toHaveProperty('first_name', expect.any(String));
                expect(row).toHaveProperty('last_name', expect.any(String));
                expect(row).toHaveProperty('registration_date', expect.any(Date));
                expect(row).toHaveProperty('role', expect.any(String));
                expect(row).toHaveProperty('organisation_id');
                expect(row.organisation_id === null || typeof row.organisation_id === 'number').toBe(true);
            });
        });
    });
    test('Should correctly seed subcategories table', () => {
        return db.query('SELECT * FROM subcategories;').then(({ rows }) => {
            expect(rows).toHaveLength(19)
            rows.forEach((row) => {
                expect(row).toHaveProperty('subcategory_id', expect.any(Number));
                expect(row).toHaveProperty('category_id', expect.any(Number));
                expect(row).toHaveProperty('name', expect.any(String));
                expect(row).toHaveProperty('description', expect.any(String));
                expect(row).toHaveProperty('created_at', expect.any(Date));
                expect(row).toHaveProperty('updated_at', expect.any(Date));
            });
        });
    });
    test('Should correctly seed events table', () => {
        return db.query('SELECT * FROM events;').then(({ rows }) => {
            expect(rows).toHaveLength(20)
            rows.forEach((row) => {
                expect(row).toHaveProperty('event_id', expect.any(Number));
                expect(row).toHaveProperty('organisation_id', expect.any(Number));
                expect(row).toHaveProperty('title', expect.any(String));
                expect(row).toHaveProperty('description', expect.any(String));
                expect(row).toHaveProperty('start_datetime', expect.any(Date));
                expect(row).toHaveProperty('end_datetime', expect.any(Date));
                expect(row).toHaveProperty('venue_id', expect.any(Number));
                expect(row).toHaveProperty('category_id', expect.any(Number));
                expect(row).toHaveProperty('subcategory_id', expect.any(Number));
                expect(row).toHaveProperty('tags', expect.any(Array));
                expect(row).toHaveProperty('is_recurring', expect.any(Boolean));
                expect(row).toHaveProperty('recurring_schedule', expect.any(Object));
                expect(row).toHaveProperty('created_at', expect.any(Date));
                expect(row).toHaveProperty('updated_at', expect.any(Date));
                expect(row).toHaveProperty('status', expect.any(String));
                expect(row).toHaveProperty('image_url', expect.any(String));
                expect(row).toHaveProperty('access_link');
                expect(row).toHaveProperty('is_online', expect.any(Boolean));
            });
        });
    });
    test('Should correctly seed attendees table', () => {
        return db.query('SELECT * FROM attendees;').then(({ rows }) => {
            expect(rows).toHaveLength(20)
            rows.forEach((row) => {
                expect(row).toHaveProperty('registration_id', expect.any(Number));
                expect(row).toHaveProperty('event_id', expect.any(Number));
                expect(row).toHaveProperty('user_id', expect.any(Number));
                expect(row).toHaveProperty('created_at', expect.any(Date));
            });
        });
    });
    test('Should correctly seed faqs table', () => {
        return db.query('SELECT * FROM faqs;').then(({ rows }) => {
            expect(rows).toHaveLength(10)
            rows.forEach((row) => {
                expect(row).toHaveProperty('faq_id', expect.any(Number));
                expect(row).toHaveProperty('question', expect.any(String));
                expect(row).toHaveProperty('answer', expect.any(String));
                expect(row).toHaveProperty('event_id', expect.any(Number));
            });
        });
    });
    test('Should correctly seed questions table', () => {
        return db.query('SELECT * FROM questions;').then(({ rows }) => {
            expect(rows).toHaveLength(7)
            rows.forEach((row) => {
                expect(row).toHaveProperty('question_id', expect.any(Number));
                expect(row).toHaveProperty('question', expect.any(String));
                expect(row).toHaveProperty('answer');
                expect(row.answer === null || typeof row.answer === 'string').toBe(true);
                expect(row).toHaveProperty('event_id', expect.any(Number));
                expect(row).toHaveProperty('user_id', expect.any(Number));
            });
        });
    });
    test('Should correctly seed reviews table', () => {
        return db.query('SELECT * FROM reviews;').then(({ rows }) => {
            expect(rows).toHaveLength(7)
            rows.forEach((row) => {
                expect(row).toHaveProperty('review_id', expect.any(Number));
                expect(row).toHaveProperty('rating', expect.any(Number));
                expect(row).toHaveProperty('review_text', expect.any(String));
                expect(row).toHaveProperty('event_id', expect.any(Number));
                expect(row).toHaveProperty('user_id', expect.any(Number));
                expect(row).toHaveProperty('created_at', expect.any(Date));
            });
        });
    });
});

