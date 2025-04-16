const testData = require('../db/data/test-data/index-test.js');
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const request = require('supertest');
const app = require('../src/app.js');
const endpoints = require('../src/endpoints.json');
const { string } = require('pg-format');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('Test seeding of test data', () => {
    test('Should correctly seed organisations table', () => {
        return db.query('SELECT * FROM organisations;').then(({ rows }) => {
            expect(rows).toHaveLength(10);
            rows.forEach((row) => {
                expect(row).toHaveProperty(
                    'organisation_id',
                    expect.any(Number)
                );
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
                expect(row).toHaveProperty('slug', expect.any(String));
                expect(row).toHaveProperty('description', expect.any(String));
                expect(row).toHaveProperty('created_at', expect.any(Date));
                expect(row).toHaveProperty('updated_at', expect.any(Date));
            });
        });
    });
    test('Should correctly seed users table', () => {
        return db.query('SELECT * FROM users;').then(({ rows }) => {
            expect(rows).toHaveLength(10);
            rows.forEach((row) => {
                expect(row).toHaveProperty('user_id', expect.any(Number));
                expect(row).toHaveProperty('email', expect.any(String));
                expect(row).toHaveProperty('password_hash', expect.any(String));
                expect(row).toHaveProperty('first_name', expect.any(String));
                expect(row).toHaveProperty('last_name', expect.any(String));
                expect(row).toHaveProperty(
                    'registration_date',
                    expect.any(Date)
                );
                expect(row).toHaveProperty('role', expect.any(String));
                expect(row).toHaveProperty('organisation_id');
                expect(
                    row.organisation_id === null ||
                        typeof row.organisation_id === 'number'
                ).toBe(true);
            });
        });
    });
    test('Should correctly seed subcategories table', () => {
        return db.query('SELECT * FROM subcategories;').then(({ rows }) => {
            expect(rows).toHaveLength(19);
            rows.forEach((row) => {
                expect(row).toHaveProperty('subcategory_id',expect.any(Number));
                expect(row).toHaveProperty('category_id', expect.any(Number));
                expect(row).toHaveProperty('name', expect.any(String));
                expect(row).toHaveProperty('slug', expect.any(String));
                expect(row).toHaveProperty('description', expect.any(String));
                expect(row).toHaveProperty('created_at', expect.any(Date));
                expect(row).toHaveProperty('updated_at', expect.any(Date));
            });
        });
    });
    test('Should correctly seed events table', () => {
        return db.query('SELECT * FROM events;').then(({ rows }) => {
            expect(rows).toHaveLength(20);
            rows.forEach((row) => {
                expect(row).toHaveProperty('event_id', expect.any(Number));
                expect(row).toHaveProperty(
                    'organisation_id',
                    expect.any(Number)
                );
                expect(row).toHaveProperty('title', expect.any(String));
                expect(row).toHaveProperty('description', expect.any(String));
                expect(row).toHaveProperty('start_datetime', expect.any(Date));
                expect(row).toHaveProperty('end_datetime', expect.any(Date));
                expect(row).toHaveProperty('venue_id', expect.any(Number));
                expect(row).toHaveProperty('category_id', expect.any(Number));
                expect(row).toHaveProperty(
                    'subcategory_id',
                    expect.any(Number)
                );
                expect(row).toHaveProperty('tags', expect.any(Array));
                expect(row).toHaveProperty('is_recurring', expect.any(Boolean));
                expect(row).toHaveProperty(
                    'recurring_schedule',
                    expect.any(Object)
                );
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
            expect(rows).toHaveLength(20);
            rows.forEach((row) => {
                expect(row).toHaveProperty(
                    'registration_id',
                    expect.any(Number)
                );
                expect(row).toHaveProperty('event_id', expect.any(Number));
                expect(row).toHaveProperty('user_id', expect.any(Number));
                expect(row).toHaveProperty('created_at', expect.any(Date));
            });
        });
    });
    test('Should correctly seed faqs table', () => {
        return db.query('SELECT * FROM faqs;').then(({ rows }) => {
            expect(rows).toHaveLength(10);
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
            expect(rows).toHaveLength(7);
            rows.forEach((row) => {
                expect(row).toHaveProperty('question_id', expect.any(Number));
                expect(row).toHaveProperty('question', expect.any(String));
                expect(row).toHaveProperty('answer');
                expect(
                    row.answer === null || typeof row.answer === 'string'
                ).toBe(true);
                expect(row).toHaveProperty('event_id', expect.any(Number));
                expect(row).toHaveProperty('user_id', expect.any(Number));
            });
        });
    });
    test('Should correctly seed reviews table', () => {
        return db.query('SELECT * FROM reviews;').then(({ rows }) => {
            expect(rows).toHaveLength(7);
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
    it('GET 404: responds with an error message when given an invalid endpoint', () => {
        return request(app)
            .get('/api/banana')
            .expect(404)
            .then((response) => {
                expect(response.status).toBe(404);
                expect(response.body.msg).toBe('Endpoint Does Not Exist');
            });
    });
});

describe('/api/categories', () => {
    test('GET 200: returns an array of all available categories', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body }) => {
                expect(body.categories).toHaveLength(10);
                body.categories.forEach((category) => {
                    expect(typeof category.category_id).toBe('number');
                    expect(typeof category.name).toBe('string');
                    expect(typeof category.description).toBe('string');
                });
            });
    });
    test('GET 200: returns category array sorted by name in ascending order by default', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body }) => {
                const sortedCategories = body.categories.toSorted((a, b) =>
                    a.name.localeCompare(b.name)
                ); //https://www.w3schools.com/jsref/jsref_localecompare.asp
                expect(body.categories).toEqual(sortedCategories);
            });
    });
});

describe('/api/categories/:category_slug/subcategories', () => {
    test('GET 200: returns an array of all available subcategories for a single category', () => {
        const categorySlug = 'family-children'
        return request(app)
            .get(`/api/categories/${categorySlug}/subcategories`)
            .expect(200)
            .then(({ body }) => {
                expect(body.subcategories).toHaveLength(2);
                body.subcategories.forEach((subcategory) => {
                    expect(subcategory.category_id).toBe(2);
                    expect(subcategory).toHaveProperty('subcategory_id', expect.any(Number));
                    expect(subcategory).toHaveProperty('name', expect.any(String));
                    expect(subcategory).toHaveProperty('slug', expect.any(String));
                    expect(subcategory).toHaveProperty('description', expect.any(String));
                });
            });
    });
    test('GET 200: returns subcategory array sorted by name in ascending order by default', () => {
        const categorySlug = 'community-social'
        return request(app)
            .get(`/api/categories/${categorySlug}/subcategories`)
            .expect(200)
            .then(({ body }) => {
                const sortedSubcategories = body.subcategories.toSorted((a, b) =>
                    a.name.localeCompare(b.name)
                ); //https://www.w3schools.com/jsref/jsref_localecompare.asp
                expect(body.subcategories).toEqual(sortedSubcategories);
            });
    });
    test("GET 200: responds with an empty array when given a valid category with no subcategories", () => {
        return request(app)
        .get("/api/categories/seniors-accessibility/subcategories")
        .expect(200)
        .then(({ body }) => {
            expect(body.subcategories).toEqual([])
        });
    });
    test("GET 404: responds with an error message when given a valid but non-existent category slug", () => {
        return request(app)
        .get("/api/categories/not-a-category/subcategories")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Category not found")
        });
    });
});

describe('/api/events', () => {
    test('GET 200: returns an array of all available events', () => {
        return request(app)
            .get(`/api/events`)
            .expect(200)
            .then(({ body }) => {
                expect(body.events).toHaveLength(20);
                body.events.forEach((event) => {
                    expect(event).toHaveProperty('event_id', expect.any(Number));
                    expect(event).toHaveProperty('organiser', expect.any(String));
                    expect(event).toHaveProperty('title', expect.any(String));
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
});

describe('/api/events/:event_id', () => {
    test('GET 200: returns a single event object when given a valid and existing event id', () => {
        const eventId = 5
        return request(app)
            .get(`/api/events/${eventId}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.event.event_id).toBe(5)
                expect(body.event).toHaveProperty('organisation_id', expect.any(Number));
                expect(body.event).toHaveProperty('organisation_name', expect.any(String));
                expect(body.event).toHaveProperty('title', expect.any(String));
                expect(body.event).toHaveProperty('description', expect.any(String));
                expect(body.event).toHaveProperty('start_datetime', expect.any(String));
                expect(body.event).toHaveProperty('end_datetime', expect.any(String));
                expect(body.event).toHaveProperty('venue_id', expect.any(Number));
                expect(body.event).toHaveProperty('venue_name', expect.any(String));
                expect(body.event).toHaveProperty('category_id', expect.any(Number));
                expect(body.event).toHaveProperty('subcategory_id', expect.any(Number));
                expect(body.event).toHaveProperty('tags', expect.any(Array));
                expect(body.event).toHaveProperty('is_recurring', expect.any(Boolean));
                expect(body.event).toHaveProperty('image_url', expect.any(String));
                expect(body.event).toHaveProperty('is_online', expect.any(Boolean));
            });
    });
    test("GET 404: responds with an error message when given a valid but non-existent event_id", () => {
        return request(app)
            .get("/api/events/99999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Event not found");
            });
    });
    test("GET 400: responds with an error message when given an invalid event_id", () => {
        return request(app)
            .get("/api/events/mothceteers")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request")
            });
    });
});

describe('/api/events/:event_id/attendees', () => {
    test("POST 201: registers a new attendee to the event and sends it back to the client", () => {
        const input = { user_id: 10 };
        const expectedAttendee = {
            registration_id: 21,
            event_id: 8,
            user_id: 10
        }
        return request(app)
            .post("/api/events/8/attendees")
            .send(input)
            .expect(201)
            .then(({ body }) => {
                expect(body.attendee).toMatchObject(expectedAttendee)
                expect(body.attendee).toMatchObject({
                    created_at: expect.any(String)
                })
            });
    });
    test("POST 201: ignores unnecessary properties", () => {
        const input = { user_id: 9, i_love_chocolate: true };
        const expectedAttendee = {
            registration_id: 21,
            event_id: 2,
            user_id: 9
        }
        return request(app)
            .post("/api/events/2/attendees")
            .send(input)
            .expect(201)
            .then(({ body }) => {
                expect(body.attendee).toMatchObject(expectedAttendee)
                expect(body.attendee).toMatchObject({
                    created_at: expect.any(String)
                })
                expect(body.attendee).not.toHaveProperty("i_love_chocolate")
            });
    });
    test("POST 201: registers multiple attendees sequentially", () => {
        const firstInput = { user_id: 10 };
        const secondInput = { user_id: 9 };
        return request(app)
            .post("/api/events/8/attendees")
            .send(firstInput)
            .expect(201)
            .then(({ body }) => {
                expect(body.attendee.registration_id).toBe(21);
                return request(app)
                    .post("/api/events/2/attendees")
                    .send(secondInput)
                    .expect(201);
            })
            .then(({ body }) => {
                expect(body.attendee.registration_id).toBe(22);
            });
    });
    test("POST 400: responds with an error message when attempting to register to an invalid event_id", () => {
        const input = { user_id: 7 };
        return request(app)
        .post("/api/events/john-talks-boats/attendees")
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
    test("POST 404: responds with an error message when attempting to register to a valid but non-existent event_id", () => {
        const input = { user_id: 6};
        return request(app)
        .post("/api/events/99999/attendees")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found")
        });
    });
    test("POST 400: responds with an error message if the user_id is missing", () => {
        const input = { user_name: "Dave"};
        return request(app)
        .post("/api/events/1/attendees")
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    })
    test("POST 404: responds with an error message if the user does not exist", () => {
        const input = { user_id: 99999 };
        return request(app)
        .post("/api/events/3/attendees")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found")
        });
    });
});
