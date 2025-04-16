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
}