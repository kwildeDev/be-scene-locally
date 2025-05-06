const db = require('../db/connection.js');
const request = require('supertest');
const app = require('../src/app.js');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env.test'});

describe('/api/events', () => {
    test('GET 200: returns an array of all available published events', () => {
        return request(app)
            .get(`/api/events`)
            .expect(200)
            .then(({ body }) => {
                expect(body.events).toHaveLength(18);
                body.events.forEach((event) => {
                    expect(event).toHaveProperty('event_id', expect.any(Number));
                    expect(event).toHaveProperty('organiser', expect.any(String));
                    expect(event).toHaveProperty('title', expect.any(String));
                    expect(event).toHaveProperty('start_datetime', expect.any(String));
                    expect(event).toHaveProperty('venue', expect.any(String));
                    expect(event).toHaveProperty('category_id', expect.any(Number));
                    expect(event).toHaveProperty('subcategory_id', expect.any(Number));
                    expect(event).toHaveProperty('is_recurring', expect.any(Boolean));
                    expect(event).toHaveProperty('created_at', expect.any(String));
                    expect(event).toHaveProperty('image_url', expect.any(String));
                    expect(event).toHaveProperty('is_online', expect.any(Boolean));
                });
            });
    });
    test('GET 200: returned array should be sorted by start_datetime in ascending order by default', () => {
        return request(app)
            .get('/api/events')
            .expect(200)
            .then(({ body }) => {
                expect(body.events).toBeSortedBy('start_datetime', {descending: false })
            });
    });
    test('GET 200: takes a sort_by query and responds with events sorted by the given column name in the default order', () => {
        return request(app)
            .get('/api/events?sort_by=created_at')
            .expect(200)
            .then(({ body }) => {
                expect(body.events).toBeSortedBy('created_at', { descending: false })
            });
    });
    test('GET 200: responds with events sorted in ascending or descending order by the default column', () => {
        return request(app)
            .get('/api/events?order=desc')
            .expect(200)
            .then(({ body }) => {
                expect(body.events).toBeSortedBy('start_datetime', { descending: true })
            });
    });
    test('GET 200: responds with events sorted in ascending or descending order by a chosen valid column', () => {
        return request(app)
        .get('/api/events?sort_by=venue&order=desc')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toBeSortedBy('venue', { descending: true })
        });
    });
    test('GET 200: ignores any invalid queries which are included alongside valid ones', () => {
        return request(app)
        .get('/api/events?sort_by=organiser&cherries&order=asc')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(18);
            expect(body.events).toBeSortedBy('organiser');
        });
    });
    test('GET 200: returns an array of events where the given category is present in the database', () => {
        return request(app)
        .get('/api/events?category=sports-recreation')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(2);
            body.events.forEach((event) => {
                expect(event.category_id).toBe(10);
            });
        });
    });
    test('GET 200: returns an empty array of events when given a category that is present in the database but has no events', () => {
        return db
                .query('INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *', 
                    ['Pets', 'pets', 'Events for pets']
                )
        .then(() => {
            return request(app)
            .get('/api/events?category=pets')
            .expect(200)
            .then(({ body }) => {
                expect(body.events).toHaveLength(0);
            });
        });
    });
    test('GET 200: returns an array of events where the given subcategory is present in the database', () => {
        return request(app)
        .get('/api/events?category=health-wellbeing&subcategory=fitness-classes')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(0);
            body.events.forEach((event) => {
                expect(event.category_id).toBe(6)
                expect(event.subcategory_id).toBe(13);
            });
        });
    });
    test('GET 200: returns an empty array of events when given a subcategory that is present in the database but has no events', () => {
        return db
                .query('INSERT INTO subcategories (category_id, name, slug, description) VALUES ($1, $2, $3, $4) RETURNING *', 
                    [10, 'Board Games', 'board-games', 'Board Game Events']
                )
        .then(() => {
            return request(app)
            .get('/api/events?category=sports-recreation&subcategory=board-games')
            .expect(200)
            .then(({ body }) => {
                expect(body.events).toHaveLength(0);
            });
        });
    });
    test('GET 200: correctly sorts events when filtered by category', () => {
        return request(app)
        .get('/api/events?category=health-wellbeing&sort_by=created_at&order=desc')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(1);
            expect(body.events).toBeSortedBy('created_at', { descending: true })
            body.events.forEach((event) => {
                expect(event.category_id).toBe(6)
            });
        });
    })
    test('GET 200: filters events based on whether a search term is present in the event title', () => {
        return request(app)
        .get('/api/events?search=club')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(3);
            expect(body.events).toBeSortedBy('start_datetime', {descending: false })
        });
    });
    test('GET 200: filters events on a search term - case insensitivity', () => {
        return request(app)
        .get('/api/events?search=CLUB')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(3);
            expect(body.events).toBeSortedBy('start_datetime', {descending: false })
        });
    });
    test('GET 200: filters events on a search term - special characters % and _ are interpreted literally', () => {
        return request(app)
        .get('/api/events?search=club%')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(0);
        });
    });
    test('GET 200: filters events on a search term - special character * is interpreted as a wildcard', () => {
        return request(app)
        .get('/api/events?search=loc*')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(3);
        });
    });
    test('GET 200: filters events on a search term - leading and trailing whitespace is ignored', () => {
        return request(app)
        .get('/api/events?search= day ')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(2);
            const titles = body.events.map(event => event.title);
            expect(titles).toContain('New Year\'s Day Beach Walk');
            expect(titles).toContain('Sunday Morning Run Club');
            //expect(titles).toContain('Local Shop Saturday Sale'); draft event included in earlier tests
        });
    });
    test('GET 200: filters events on a search term - whitespace within search term is retained', () => {
        return request(app)
        .get('/api/events?search=  club meeting')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(1);
        });
    });
    test('GET 200: filters events on a search term - empty search term returns all events', () => {
        return request(app)
        .get('/api/events?search= ')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(18); //published only
        });
    });
    test('GET 200: filters events on a search term - empty array returned if search term not found', () => {
        return request(app)
        .get('/api/events?search=vwxyz')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toBeInstanceOf(Array);
            expect(body.events).toHaveLength(0);
        });
    });
    test('GET 200: filters events on a search term - interaction with sorting query', () => {
        return request(app)
        .get('/api/events?search=day&sort_by=venue&order=desc')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(2);
            expect(body.events).toBeSortedBy('venue', {descending: true })
            //expect(body.events[0].title).toBe('Local Shop Saturday Sale'); draft event included in earlier tests
            expect(body.events[0].title).toBe('Sunday Morning Run Club');
            expect(body.events[1].title).toBe('New Year\'s Day Beach Walk');
        });
    });
    test('GET 200: filters events on a given date YYYY-MM-DD', () => {
        return request(app)
        .get('/api/events?date=2024-11-05')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(2);
            body.events.forEach((event) => {
                expect(event.start_datetime.startsWith('2024-11-05')).toBe(true)
            });
        });
    });
    test('GET 200: filters events that have any of the provided tags', () => {
        return request(app)
        .get('/api/events?tags=local,market')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(1);
            body.events.forEach(event => {
                expect(event.tags.some(tag => ['local', 'market'].includes(tag))).toBe(true);
            });
        });
    });
    test('GET 200: filters events that have a given venue', () => {
        return request(app)
        .get('/api/events?venue=Keswick Community Centre')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(2);
            body.events.forEach((event) => {
                expect(event.venue).toBe('Keswick Community Centre');
            });
        })
    });
    test('GET 200: returns an empty array if no events match the venue name', () => {
        return request(app)
        .get('/api/events?venue=Buckingham Palace')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toBeInstanceOf(Array);
            expect(body.events).toHaveLength(0);
        });
    });
    test('GET 200: filters events by venue name case-insensitively', () => {
        return request(app)
        .get('/api/events?venue=keswick%20community%20centre')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(2);
            body.events.forEach((event) => {
                expect(event.venue).toBe('Keswick Community Centre');
            });
        });
    });
    test('GET 200: filters events that have a given organiser', () => {
        return request(app)
        .get('/api/events?organiser=Keswick Seniors Society')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(2);
            body.events.forEach((event) => {
                expect(event.organiser).toBe('Keswick Seniors Society');
            });
        })
    });
    test('GET 200: returns an empty array if no events match the organiser name', () => {
        return request(app)
        .get('/api/events?organiser=Keswick Cool Events')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toBeInstanceOf(Array);
            expect(body.events).toHaveLength(0);
        });
    });
    test('GET 200: filters events by organiser name case-insensitively', () => {
        return request(app)
        .get('/api/events?organiser=derwentwater%20conservation%20group')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toHaveLength(2);
            body.events.forEach((event) => {
                expect(event.organiser).toBe('Derwentwater Conservation Group');
            });
        });
    });
    test('GET 200: filters events where is_recurring is true ', () => {
        return request(app)
        .get('/api/events?recurring=true')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toBeInstanceOf(Array);
            expect(body.events).toHaveLength(7);
            body.events.forEach((event) => {
                expect(event.is_recurring).toBe(true);
            });
        });
    });
    test('GET 200: filters events where is_recurring is false', () => {
        return request(app)
        .get('/api/events?recurring=false')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toBeInstanceOf(Array);
            expect(body.events).toHaveLength(11); // published events only
            body.events.forEach((event) => {
                expect(event.is_recurring).toBe(false);
            });
        });
    });
    test('GET 200: filters events where is_online is true ', () => {
        return request(app)
        .get('/api/events?online=true')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toBeInstanceOf(Array);
            expect(body.events).toHaveLength(1);
            body.events.forEach((event) => {
                expect(event.is_online).toBe(true);
            });
        });
    });
    test('GET 200: filters events where is_online is false', () => {
        return request(app)
        .get('/api/events?online=false')
        .expect(200)
        .then(({ body }) => {
            expect(body.events).toBeInstanceOf(Array);
            expect(body.events).toHaveLength(17);
            body.events.forEach((event) => {
                expect(event.is_online).toBe(false);
            });
        });
    });
    test('GET 400: responds with an error message when given an invalid date value', () => {
        return request(app)
        .get('/api/events?date=chips')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid Date Value');
        });
    });
    test('GET 400: responds with an error message when given an invalid date format', () => {
        return request(app)
        .get('/api/events?date=2024/11/05')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid Date Format - Please Use YYYY-MM-DD');
        });
    });
    test('GET 400: responds with an error message when given an invalid sort_by query', () => {
        return request(app)
        .get('/api/events?sort_by=chips')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
        });
    });
    test('GET 400: responds with an error message when given an invalid order query', () => {
        return request(app)
        .get('/api/events?order=alphabetical')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
        });
    });
    test('GET 404: returns an error message when given a category that does not exist in the database', () => {
        return request(app)
        .get('/api/events?category=easter-eggs')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Category Not Found');
        });
    });
    test('GET 404: returns an error message when given a subcategory that does not exist in the database', () => {
        return request(app)        
        .get('/api/events?category=sports-recreation&subcategory=apology-olympics')        
        .expect(404)        
        .then(({ body }) => {            
            expect(body.msg).toBe('Subcategory Not Found');        
        });    
    });
    test('GET 400: responds with an error message when given an invalid value (not boolean) for is_recurring', () => {
        return request(app)
        .get('/api/events?recurring=errors')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
        });
    });
    test('GET 400: responds with an error message when given an invalid value (not boolean) for is_online', () => {
        return request(app)
        .get('/api/events?online=zoom')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
        });
    });
    

    describe('POST /api/events', () => {
        const generateEventInput = (overrides = {}) => ({
            organisation_id: 3,
            title: 'Tree Planting',
            description: 'Help us plant sapling trees donated by Trees 4 Life.',
            start_datetime: '2025-04-19T10:00:00Z',
            end_datetime: '2025-04-19T12:00:00Z',
            venue_id: 3,
            category_id: 3,
            subcategory_id: 7,
            tags: ['trees', 'environment', 'volunteer'],
            is_recurring: false,
            recurring_schedule: null,
            status: 'published',
            image_url: 'tree_planting.jpg',
            access_link: null,
            is_online: false,
            signup_required: false,
            ...overrides,
        });
        const generateExpectedEvent = (overrides = {}) => ({
            event_id: 21,
            organisation_id: 3,
            title: 'Tree Planting',
            description: 'Help us plant sapling trees donated by Trees 4 Life.',
            start_datetime: '2025-04-19T10:00:00.000Z',
            end_datetime: '2025-04-19T12:00:00.000Z',
            venue_id: 3,
            category_id: 3,
            subcategory_id: 7,
            tags: ['trees', 'environment', 'volunteer'],
            is_recurring: false,
            recurring_schedule: null,
            status: 'published',
            image_url: 'tree_planting.jpg',
            access_link: null,
            is_online: false,
            signup_required: false,
            ...overrides,        
        });
        test('POST 201: adds a new event', () => {
            return request(app)
                .post('/api/events')
                .send(generateEventInput())
                .expect(201)
                .then(({ body }) => {
                    expect(body.event).toMatchObject(generateExpectedEvent())
                    expect(body.event).toMatchObject({
                        created_at: expect.any(String)
                    })
                    expect(body.event).toMatchObject({
                        updated_at: expect.any(String)
                    })
                });
        });
        test('POST 400: responds with an error when given an invalid organisation_id', () => {
            return request(app)
                .post('/api/events')
                .send(generateEventInput({ organisation_id: 'derwentwater-conservation' }))
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
                });
        });
        test('POST 400: responds with an error when given an invalid venue_id', () => {
            return request(app)
                .post('/api/events')
                .send(generateEventInput({ venue_id: 'derwentwater-lakeside' }))
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
                });
        });
        test('POST 404: responds with an error when given a valid but non-existent organisation_id', () => {
            return request(app)
                .post('/api/events')
                .send(generateEventInput({ organisation_id: 99999 }))
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('ORGANISATION ID 99999 Does Not Exist')
                });
        });
        test('POST 404: responds with an error when given a valid but non-existent subcategory_id', () => {
            return request(app)
                .post('/api/events')
                .send(generateEventInput({ subcategory_id: 54321 }))
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('SUBCATEGORY ID 54321 Does Not Exist')
                });
        });
        test('POST 404: responds with an error when a non-nullable field is missing', () => {
            return request(app)
                .post('/api/events')
                .send(generateEventInput({ title: null }))
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
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
                expect(body.event).toHaveProperty('signup_required', expect.any(Boolean));
            });
    });
    test('GET 404: responds with an error message when given a valid but non-existent event_id', () => {
        return request(app)
            .get('/api/events/99999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Event not found');
            });
    });
    test('GET 400: responds with an error message when given an invalid event_id', () => {
        return request(app)
            .get('/api/events/mothceteers')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request')
            });
    });
    test('PATCH 200: returns the existing event object with only the provided fields updated, while all other details remain unchanged', () => {
        const dataToUpdate = {
            title: 'Community Coffee Afternoon',
            start_datetime: '2024-11-12T14:00:00.000Z',
            end_datetime: '2024-11-12T16:00:00.000Z',
            venue_id: 5
        };
        return request(app)
            .patch('/api/events/1')
            .send(dataToUpdate)
            .expect(200)
            .then(({ body }) => {
                expect(body.event).toMatchObject(dataToUpdate)
                expect(body.event.description).toBe("A friendly gathering for locals to chat and connect.")
                expect(body.event.status).toBe("published")
                expect(new Date(body.event.updated_at).getTime()).toBeGreaterThan(new Date(body.event.created_at).getTime());
            });
    });
    test('PATCH 200: returns the existing event object with only the status updated, while all other details remain unchanged', () => {
        const dataToUpdate = {
            status: 'cancelled'
        };
        return request(app)
            .get('/api/events/1')
            .expect(200)
            .then(({ body }) => {
                const originalEvent = body.event

                return request(app)
                .patch('/api/events/1')
                .send(dataToUpdate)
                .expect(200)
                .then(({ body }) => {
                    const updatedEvent = body.event
                    expect(updatedEvent.status).toBe(dataToUpdate.status)
                    Object.keys(originalEvent).forEach((key) => {
                        if (key !== 'status' && key !== 'updated_at') {
                            expect(updatedEvent[key]).toEqual(originalEvent[key])
                        }
                    })
                    expect(new Date(updatedEvent.updated_at).getTime()).toBeGreaterThan(new Date(updatedEvent.created_at).getTime());
                });
            });
    });
    test('PATCH 400: responds with an error message when given an invalid event_id', () => {
        const dataToUpdate = {
            description: 'Watch cats doing daft things caught on camera',
        };
        return request(app)
            .patch('/api/events/cat-videos')
            .send(dataToUpdate)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request')
            });
    });
    test('PATCH 404: responds with an error message when given a valid but non-existent event_id', () => {
        const dataToUpdate = {
            title: 'Error message workshop',
        };
        return request(app)
            .patch('/api/events/328576')
            .send(dataToUpdate)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Event not found or could not be updated')
            });
    });
    test('PATCH 403: responds with an error message on an attempt to change the organisation_id', () => {
        const dataToUpdate = {
            organisation_id: 12345,
        };
        return request(app)
            .patch('/api/events/2')
            .send(dataToUpdate)
            .expect(403)
            .then(({ body }) => {
                expect(body.msg).toBe('Forbidden - certain fields cannot be updated')
            });
    });
    test('PATCH 403: responds with an error message on an attempt to revert status to "draft"', () => {
        const dataToUpdate = {
            status: 'draft',
        };
        return request(app)
            .patch('/api/events/2')
            .send(dataToUpdate)
            .expect(403)
            .then(({ body }) => {
                expect(body.msg).toBe('Forbidden - certain fields cannot be updated')
            });
    });
    test('PATCH 400: responds with an error message when the venue ID is null', () => {
        const dataToUpdate = {
            venue_id: null,
        };
        return request(app)
            .patch('/api/events/3')
            .send(dataToUpdate)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request')
            });
    });
    test('DELETE 204: deletes an event specified by event_id and returns no body', () => {
        return request(app)
        .delete('/api/events/4')
        .expect(204)
    });
    test('DELETE 400: responds with an error message if given an invalid event_id', () => {
        return request(app)
        .delete('/api/events/rubbish-event')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        });
    });
    test('DELETE 403: responds with an error message if event status is not "draft"', () => {
        return request(app)
        .delete('/api/events/5')
        .expect(403)
        .then(({ body }) => {
            expect(body.msg).toBe('Forbidden - cannot delete events that have progressed beyond "draft" status')
        });
    });
    test('DELETE 403: responds with an error message if event status is not "draft"', () => {
        return request(app)
        .delete('/api/events/6')
        .expect(403)
        .then(({ body }) => {
            expect(body.msg).toBe('Forbidden - cannot delete events that have progressed beyond "draft" status')
        });
    });
    test('DELETE 404: responds with an error message if given a valid but non-existent event_id', () => {
        return request(app)
        .delete('/api/events/9999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Event Not Found')
        });
    });
});

describe('/api/events/:event_id/attendees', () => {
    test('GET 200: returns an array of all attendees for an event', () => {
        const staffToken = jwt.sign(
            { user_id: 4, role: 'organiser', organisation_id: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return request(app)
            .get(`/api/events/3/attendees`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.attendees).toHaveLength(4);
                expect(body.attendees).toBeInstanceOf(Array)
                body.attendees.forEach((attendee) => {
                    expect(attendee.event_id).toBe(3);
                    expect(attendee).toHaveProperty('registration_id', expect.any(Number));
                    expect(attendee).toHaveProperty('user_id', expect.any(Number));
                    expect(attendee).toHaveProperty('name');
                    expect(attendee).toHaveProperty('email');
                    expect(attendee).toHaveProperty('is_registered_user', expect.any(Boolean));
                    expect(attendee).toHaveProperty('created_at', expect.any(String));
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
            .get(`/api/events/3/attendees`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(403)
            .then(({ body }) => {
                expect(body.msg).toBe('Forbidden - Access Denied')
            });
    });
    test('GET 400: responds with an error if given an invalid event_id', () => {
        const staffToken = jwt.sign(
            { user_id: 4, role: 'organiser', organisation_id: 3 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return request(app)
            .get(`/api/events/three/attendees`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
    test('GET 401: responds with an error if no token is provided', () => {
        return request(app)
        .get(`/api/events/3/attendees`)
        .expect(401)
        .then(({ body }) => {
            expect(body.msg).toBe('Unauthorised - No Token Provided');
        });
    });
    test('GET 401: responds with an error if an invalid bearer token is provided', () => {
        const invalidToken = 'not-a-valid-token';
        return request(app)
            .get('/api/events/3/attendees')
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
            .get(`/api/events/3/attendees`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(401)
            .then(({ body }) => {
                expect(body.msg).toBe('Token Expired')
            });
        });
    test('GET 404: responds with an error if given a valid but non-existent event_id', () => {
        const staffToken = jwt.sign(
            { user_id: 4, role: 'organiser', organisation_id: 0 },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return request(app)
            .get(`/api/events/99999/attendees`)
            .set(`Authorization`, `Bearer ${staffToken}`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Event Does Not Exist')
            });
        });
    test('POST 201: registers a new attendee to the event and sends it back to the client - registered user', () => {
        const input = { user_id: 10, name: 'Amanda Hernandez', email: 'attendee6@example.com', is_registered_user: true};
        const expectedAttendee = {
            registration_id: 21,
            event_id: 8,
            user_id: 10,
            name: 'Amanda Hernandez',
            email: 'attendee6@example.com',
            is_registered_user: true
        }
        return request(app)
            .post('/api/events/8/attendees')
            .send(input)
            .expect(201)
            .then(({ body }) => {
                expect(body.attendee).toMatchObject(expectedAttendee)
                expect(body.attendee).toMatchObject({
                    created_at: expect.any(String)
                })
            });
    });
    test('POST 201: registers a new (guest) attendee to the event and sends it back to the client - non-registered user', () => {
        const input = { name: 'Severus Snape', email: 'ssnape@hogwarts.ac.uk', is_registered_user: false };
        const expectedAttendee = {
            registration_id: 21,
            event_id: 8,
            user_id: null,
            name: 'Severus Snape',
            email: 'ssnape@hogwarts.ac.uk',
            is_registered_user: false,
        }
        return request(app)
            .post('/api/events/8/attendees')
            .send(input)
            .expect(201)
            .then(({ body }) => {
                expect(body.attendee).toMatchObject(expectedAttendee)
                expect(body.attendee).toMatchObject({
                    created_at: expect.any(String)
                })
            });
    });
    test('POST 201: ignores unnecessary properties', () => {
        const input = { user_id: 9, i_love_chocolate: true, name: 'Kevin Martinez', email: 'attendee5@example.com', is_registered_user: true };
        const expectedAttendee = {
            registration_id: 21,
            event_id: 2,
            user_id: 9,
            name: 'Kevin Martinez',
            email: 'attendee5@example.com',
            is_registered_user: true
        }
        return request(app)
            .post('/api/events/2/attendees')
            .send(input)
            .expect(201)
            .then(({ body }) => {
                expect(body.attendee).toMatchObject(expectedAttendee)
                expect(body.attendee).toMatchObject({
                    created_at: expect.any(String)
                })
                expect(body.attendee).not.toHaveProperty('i_love_chocolate')
            });
    });
    test('POST 201: registers multiple attendees sequentially', () => {
        const firstInput = { user_id: 10, name: 'Amanda Hernandez', email: 'attendee6@example.com', is_registered_user: true };
        const secondInput = { user_id: 9, name: 'Kevin Martinez', email: 'attendee5@example.com', is_registered_user: true };
        return request(app)
            .post('/api/events/8/attendees')
            .send(firstInput)
            .expect(201)
            .then(({ body }) => {
                expect(body.attendee.registration_id).toBe(21);
                return request(app)
                    .post('/api/events/2/attendees')
                    .send(secondInput)
                    .expect(201);
            })
            .then(({ body }) => {
                expect(body.attendee.registration_id).toBe(22);
            });
    });
    test('POST 400: responds with an error message when attempting to register to an invalid event_id', () => {
        const input = { user_id: 7, name: 'Christopher Garcia', email: 'attendee3@example.com', is_registered_user: true };
        return request(app)
        .post('/api/events/john-talks-boats/attendees')
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        });
    });
    test('POST 404: responds with an error message when attempting to register to a valid but non-existent event_id', () => {
        const input = { user_id: 6, name: 'Sarah Davis', email: 'attendee2@example.com', is_registered_user: true };
        return request(app)
        .post('/api/events/99999/attendees')
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('EVENT ID 99999 Does Not Exist')
        });
    });
    test('POST 404: responds with an error message if the user does not exist', () => {
        const input = { user_id: 99999, name: 'Invalid User', email: 'invalid@idontexist.org', is_registered_user: true };
        return request(app)
        .post('/api/events/3/attendees')
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('USER ID 99999 Does Not Exist')
        });
    });
});