const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db
        .query(`SELECT category_id, name, description FROM categories ORDER BY name ASC;`)
        .then(({ rows }) => {
            return rows;
        });
};

exports.fetchCategoryIdBySlug = (categorySlug) => {
    return db
        .query(`SELECT category_id FROM categories WHERE slug = $1;`, [
            categorySlug,
        ])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Category Not Found'})
            }
            return rows[0] || null;
        });
};