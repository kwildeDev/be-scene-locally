const db = require('../../db/connection');

exports.fetchEvents = () => {
    return db
        .query(`SELECT events.event_id, events.title, events.start_datetime, events.category_id, events.subcategory_id, events.is_recurring, events.image_url, events.is_online, organisations.name AS organiser, venues.name AS venue 
            FROM events 
            INNER JOIN organisations
            ON events.organisation_id = organisations.organisation_id
            INNER JOIN venues
            ON events.venue_id = venues.venue_id
            ORDER BY events.start_datetime ASC;`)
        .then(({ rows }) => {
            return rows;
        });
};