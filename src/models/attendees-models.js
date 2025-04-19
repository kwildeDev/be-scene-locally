const db = require('../../db/connection');

exports.createAttendee = (event_id, { user_id }) => {
    return db
    .query(`INSERT INTO attendees (event_id, user_id)
            VALUES ($1, $2)
            RETURNING *;`, [event_id, user_id]
        )
        .then((result) => {
            return result.rows[0];
        });
};

exports.fetchEventAttendees = (event_id, organisation_id) => {
    return db
    .query(`SELECT event_id, organisation_id FROM events WHERE event_id = $1`,
        [event_id]
    )
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Event Does Not Exist'});
        }
        const eventOrgId = rows[0].organisation_id
        if (eventOrgId !== organisation_id) {
            return Promise.reject({ status: 403, msg: 'Forbidden - Access Denied'});
        }
        return db
        .query(`SELECT * FROM attendees WHERE event_id = $1`,
            [event_id]
        )
        .then((result) => {
            return result.rows;
        });
    });
};