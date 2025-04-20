const db = require('../../db/connection');

exports.fetchEvents = (sort_by = 'start_datetime', order = 'asc', category) => {
    const validSortBys = ['start_datetime', 'created_at', 'organiser', 'venue']
    const validOrders = ['asc', 'desc']
    if (!validSortBys.includes(sort_by) || (!validOrders.includes(order))) {
        return Promise.reject({ status: 400, msg: "Bad Request"})
    }
    const categoryStr = category ? `WHERE categories.slug = '${category}'` : ``
    const sortColumn = sort_by === 'organiser' ? 'organisations.name' : sort_by === 'venue' ? 'venues.name' : `events.${sort_by}`;
    return db
        .query(
            `SELECT events.event_id, events.title, events.start_datetime, events.category_id, events.subcategory_id, events.is_recurring, events.created_at, events.image_url, events.is_online, organisations.name AS organiser, venues.name AS venue 
            FROM events 
            INNER JOIN organisations
            ON events.organisation_id = organisations.organisation_id
            INNER JOIN venues
            ON events.venue_id = venues.venue_id
            INNER JOIN categories
            ON events.category_id = categories.category_id
            ${categoryStr}
            ORDER BY ${sortColumn} ${order};`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.fetchEventById = (event_id) => {
    return db
        .query(
            `SELECT events.*, organisations.name AS organisation_name, venues.name AS venue_name
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
};

exports.updateEvent = (event_id, dataToUpdate) => {
    const fieldsToUpdate = Object.keys(dataToUpdate)
    const values = Object.values(dataToUpdate)
    const updateStatement = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`).join(", ");
    return db
        .query(`UPDATE events SET ${updateStatement} WHERE event_id = $${fieldsToUpdate.length + 1}
            RETURNING event_id;`, [...values, event_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Event not found or could not be updated' });
            }
            const updatedEventId = rows[0].event_id;
            return db
            .query(
                `SELECT events.*, organisations.name AS organisation_name, venues.name AS venue_name
                FROM events 
                INNER JOIN organisations
                ON events.organisation_id = organisations.organisation_id
                INNER JOIN venues
                ON events.venue_id = venues.venue_id
                WHERE events.event_id = $1;`,[updatedEventId]
            )
        })
        .then(({ rows}) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 500, msg: 'Failed to retrieve updated event' });
            }
            return rows[0]
        });
};

exports.removeEvent = (event_id) => {
    return db
        .query(`SELECT status FROM events WHERE event_id = $1`, [event_id])
        .then((result) => {
            if (result.rowCount === 0) {
                return Promise.reject({ status: 404, msg: "Event Not Found"})
            }
            if (result.rows[0].status !== 'draft') {
                return Promise.reject({ status: 403, msg: 'Forbidden - cannot delete events that have progressed beyond "draft" status'})
            }
            return db.query(`DELETE FROM events WHERE event_id = $1`, [event_id])
        });
};