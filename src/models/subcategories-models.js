const db = require('../../db/connection');

exports.fetchSubcategories = () => {
    return db
        .query(`SELECT subcategory_id, category_id, name, description FROM subcategories;`)
        .then(({ rows }) => {
            return rows;
        });
};