const db = require('../../db/connection');

exports.fetchEventsByOrganisationId = (organisation_id) => {
    return db
        .query(
            `SELECT EXISTS (SELECT 1 FROM organisations WHERE organisation_id = $1)`, [organisation_id]
        )
        .then(({ rows }) => {
            if (!rows[0].exists) {
                return Promise.reject({ status: 404, msg: 'Organisation Does Not Exist'});
            }
            return db
                .query(
                    `SELECT events.event_id, events.title, events.status, events.start_datetime, events.category_id, events.subcategory_id, events.is_recurring, events.image_url, events.is_online, 
                    events.organisation_id, venues.name AS venue 
                    FROM events
                    INNER JOIN venues
                    ON events.venue_id = venues.venue_id
                    WHERE events.organisation_id = $1
                    ORDER BY events.start_datetime ASC;`,[organisation_id]
                    )
                .then(({ rows }) => {
                    return rows;
                });
        });
};

exports.fetchTagsByOrganisationId = (organisation_id) => {
    return db
        .query(
            `SELECT EXISTS (SELECT 1 FROM organisations WHERE organisation_id = $1)`, [organisation_id]
        )
        .then(({ rows }) => {
            if (!rows[0].exists) {
                return Promise.reject({ status: 404, msg: 'Organisation Does Not Exist'});
            }
            return db
                .query(
                    `SELECT DISTINCT unnest(events.tags) AS unique_tag 
                    FROM events
                    WHERE events.organisation_id = $1
                    ORDER BY unique_tag ASC;`,[organisation_id]
                    )
                .then(({ rows }) => {
                    return rows.map(row => row.unique_tag);
                });
        });
};