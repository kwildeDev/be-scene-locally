const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db
        .query(`SELECT category_id, name, description FROM categories;`)
        .then(({ rows }) => {
            return rows;
        });
};
