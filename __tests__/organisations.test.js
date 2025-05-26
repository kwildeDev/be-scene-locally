const db = require('../db/connection.js');
const request = require('supertest');
const app = require('../src/app.js');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env.test'});

describe('/api/organisations/:organisation_id/events', () => {
    test('GET 200: returns an array of all available events for a single organisation', () => {
        const staffToken = jwt.sign(
            { user_id: 4, role: 'organiser', organisation_id: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return request(app)
            .get(`/api/organisations/3/events`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.events).toHaveLength(2);
                expect(body.events).toBeInstanceOf(Array)
                body.events.forEach((event) => {
                    expect(event.organisation_id).toBe(3);
                    expect(event).toHaveProperty('event_id', expect.any(Number));
                    expect(event).toHaveProperty('title', expect.any(String));
                    expect(event).toHaveProperty('status', expect.any(String));
                    expect(event).toHaveProperty('start_datetime', expect.any(String));
                    expect(event).toHaveProperty('venue', expect.any(String));
                    expect(event).toHaveProperty('category_id', expect.any(Number));
                    expect(event).toHaveProperty('subcategory_id', expect.any(Number));
                    expect(event).toHaveProperty('is_recurring', expect.any(Boolean));
                    expect(event).toHaveProperty('image_url', expect.any(String));
                    expect(event).toHaveProperty('is_online', expect.any(Boolean));
                });
            });
    });
    test('GET 403: responds with an error if an unauthorised user tries to access', () => {
        const staffToken = jwt.sign(
            { user_id: 2, role: 'organiser', organisation_id: 1 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return request(app)
            .get(`/api/organisations/3/events`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(403)
            .then(({ body }) => {
                expect(body.msg).toBe('Forbidden - Access Denied');
            });
    });
    test('GET 400: responds with an error if given an invalid organisation_id', () => {
        const staffToken = jwt.sign(
            { user_id: 4, role: 'organiser', organisation_id: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return request(app)
            .get(`/api/organisations/three/events`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
    test('GET 401: responds with an error if no token is provided', () => {
        return request(app)
        .get(`/api/organisations/3/events`)
        .expect(401)
        .then(({ body }) => {
            expect(body.msg).toBe('Unauthorised - No Token Provided');
        });
    });
    test('GET 401: responds with an error if an invalid bearer token is provided', () => {
        const invalidToken = 'not-a-valid-token';
        return request(app)
            .get('/api/organisations/3/events')
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(401)
            .then(({ body }) => {
                expect(body.msg).toBe('Unauthorised - Invalid Token');
            });
    });
    test('GET 401: responds with an error if an expired token is provided', () => {
        const staffToken = jwt.sign(
            { user_id: 4, role: 'organiser', organisation_id: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '0s' }
        );
        return request(app)
            .get(`/api/organisations/3/events`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(401)
            .then(({ body }) => {
                expect(body.msg).toBe('Token Expired')
            });
        });
    test('GET 404: responds with an error if given a valid but non-existent organisation_id', () => {
        const staffToken = jwt.sign(
            { user_id: 4, role: 'organiser', organisation_id: 0 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return request(app)
            .get(`/api/organisations/0/events`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Organisation Does Not Exist')
            });
        });
    test('Database uses indexes for event queries', async () => {
        const { rows } = await db.query(
            `EXPLAIN ANALYZE 
                SELECT events.event_id, events.title, events.organisation_id, organisations.name AS organiser, venues.name AS venue 
                FROM events
                INNER JOIN organisations ON events.organisation_id = organisations.organisation_id
                INNER JOIN venues ON events.venue_id = venues.venue_id
                WHERE events.organisation_id = $1
                ORDER BY events.start_datetime ASC;`, [3]
        );
        const queryPlan = rows.map(row => row["QUERY PLAN"]).join("\n");
        expect(queryPlan).toContain('Index Scan using idx_events_organisation_id');
        expect(queryPlan).toContain('Index Scan using idx_organisations_organisation_id');
        expect(queryPlan).toContain('Index Scan using venues_pkey');
    });
    test('GET 200: returns an array of all available tags for a single organisation', () => {
        const staffToken = jwt.sign(
            { user_id: 4, role: 'organiser', organisation_id: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return request(app)
            .get(`/api/organisations/3/tags`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(200)
            .then(({ body }) => {
                function areElementsUnique(tagsArray) {
                    return new Set(tagsArray).size === tagsArray.length
                }
                expect(body.tags).toBeInstanceOf(Array)
                body.tags.forEach((tag) => {
                    expect(typeof tag).toBe("string");
                });
                expect(areElementsUnique(body.tags)).toBe(true);
            });
    });
});