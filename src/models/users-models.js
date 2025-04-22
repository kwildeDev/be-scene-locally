const db = require('../../db/connection');

exports.fetchUserByEmail = (email) => {
    return db
        .query('SELECT * FROM users WHERE email = $1', [email])
        .then((result) => {
            return result.rows[0] || null;
        });
};



exports.fetchUserById = (user_id) => {
    return db
        .query(
            `SELECT users.user_id, users.email, users.first_name, users.last_name, users.role, users.organisation_id, organisations.name AS organisation_name
            FROM users
            LEFT JOIN organisations
            ON users.organisation_id = organisations.organisation_id
            WHERE users.user_id = $1;`,[user_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        })
        .catch((err) => {
            throw err;
        });
};