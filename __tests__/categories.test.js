const db = require('../db/connection.js');
const request = require('supertest');
const app = require('../src/app.js');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env.test'});

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
    test('GET 200: responds with an empty array when given a valid category with no subcategories', () => {
        return request(app)
        .get('/api/categories/seniors-accessibility/subcategories')
        .expect(200)
        .then(({ body }) => {
            expect(body.subcategories).toEqual([])
        });
    });
    test('GET 404: responds with an error message when given a valid but non-existent category slug', () => {
        return request(app)
        .get('/api/categories/not-a-category/subcategories')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Category Not Found")
        });
    });
});

// Category and subcategory lookup by ID for event management
describe('/api/categories/id/:category_id', () => {
    test('GET 200: returns a single category object by its ID number', () => {
        return request(app)
            .get(`/api/categories/id/1`)
            .expect(200)
            .then(({ body }) => {
                expect(body.category).toHaveProperty('category_id', expect.any(Number));
                expect(body.category).toHaveProperty('name', expect.any(String));
                expect(body.category).toHaveProperty('slug', expect.any(String));
                expect(body.category).toHaveProperty('description', expect.any(String));
            });
    });  
    test('GET 404: responds with an error message when given a valid but non-existent category ID', () => {
        return request(app)
        .get('/api/categories/id/999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Category Not Found")
        });
    });
});
describe('/api/categories/id/:category_id/subcategories', () => {
    test('GET 200: returns an array of available subcategories for a valid category ID', () => {
        return request(app)
            .get(`/api/categories/id/1/subcategories`)
            .expect(200)
            .then(({ body }) => {
                body.subcategories.forEach((subcategory) => {
                    expect(subcategory).toHaveProperty('subcategory_id', expect.any(Number));
                    expect(subcategory).toHaveProperty('category_id', expect.any(Number));
                    expect(subcategory).toHaveProperty('name', expect.any(String));
                    expect(subcategory).toHaveProperty('slug', expect.any(String));
                    expect(subcategory).toHaveProperty('description', expect.any(String));
                });
            });
    });
    test('GET 404: responds with an error message when given a valid but non-existent category ID', () => {
        return request(app)
        .get('/api/categories/id/999/subcategories')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Category Not Found")
        });
    });
});
describe('/api/categories/id/:category_id/subcategories/:subcategory_id', () => {
    test('GET 200: returns a single subcategory object by its ID number', () => {
        return request(app)
            .get(`/api/categories/id/1/subcategories/2`)
            .expect(200)
            .then(({ body }) => {
                expect(body.subcategory).toHaveProperty('subcategory_id', expect.any(Number));
                expect(body.subcategory).toHaveProperty('category_id', expect.any(Number));
                expect(body.subcategory).toHaveProperty('name', expect.any(String));
                expect(body.subcategory).toHaveProperty('slug', expect.any(String));
                expect(body.subcategory).toHaveProperty('description', expect.any(String));
            });
    });
    test('GET 404: responds with an error message when given a valid but non-existent subcategory ID', () => {
        return request(app)
        .get('/api/categories/id/1/subcategories/999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Subcategory Not Found")
        });
    });
});
