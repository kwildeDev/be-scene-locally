const db = require('../../db/connection');

exports.fetchVenues = () => {
    return db
        .query(
            `SELECT venues.venue_id, venues.name, venues.address_line1, venues.address_line2, venues.city, venues.county, venues.postcode
            FROM venues 
            ORDER BY venues.name ASC;`
        )
        .then(({ rows }) => {
            return rows;
        });
};