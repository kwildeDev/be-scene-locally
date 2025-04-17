const db = require('../../db/connection');

exports.fetchEvents = () => {
    return db
        .query(
            `SELECT events.event_id, events.title, events.start_datetime, events.category_id, events.subcategory_id, events.is_recurring, events.image_url, events.is_online, organisations.name AS organiser, venues.name AS venue 
            FROM events 
            INNER JOIN organisations
            ON events.organisation_id = organisations.organisation_id
            INNER JOIN venues
            ON events.venue_id = venues.venue_id
            ORDER BY events.start_datetime ASC;`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.fetchEventById = (event_id) => {
    return db
        .query(
            `SELECT events.event_id, events.organisation_id, organisations.name AS organisation_name, events.title, events.description,
            events.start_datetime, events.end_datetime, events.venue_id, venues.name AS venue_name, events.category_id, events.subcategory_id, 
            events.tags, events.is_recurring, events.image_url, events.is_online, events.signup_required 
            FROM events 
            INNER JOIN organisations
            ON events.organisation_id = organisations.organisation_id
            INNER JOIN venues
            ON events.venue_id = venues.venue_id
            WHERE events.event_id = $1;`,[event_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: 'Event not found',
                });
            }
            return result.rows[0];
        });
};

exports.createEvent = ({ organisation_id, title, description, start_datetime, end_datetime, venue_id, category_id, subcategory_id,
    tags, is_recurring, recurring_schedule, status, image_url, access_link, is_online, signup_required }) => {
    return db
        .query(`INSERT INTO events (organisation_id, title, description, start_datetime, end_datetime, venue_id, category_id, subcategory_id,
            tags, is_recurring, recurring_schedule, status, image_url, access_link, is_online, signup_required)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                RETURNING *;`, [organisation_id, title, description, start_datetime, end_datetime, venue_id, category_id, subcategory_id,
                    tags, is_recurring, recurring_schedule, status, image_url, access_link, is_online, signup_required]
            )
            .then((result) => {
                return result.rows[0];
            });
}