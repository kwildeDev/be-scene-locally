const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db
        .query(`SELECT category_id, name, description FROM categories ORDER BY name ASC;`)
        .then(({ rows }) => {
            return rows;
        });
};
