const db = require('../../db/connection');

exports.fetchCategories = () => {
    return db
        .query(`SELECT category_id, name, slug, description FROM categories ORDER BY name ASC;`)
        .then(({ rows }) => {
            return rows;
        });
};

exports.fetchCategoryById = (categoryId) => {
    return db
        .query(`SELECT category_id, name, slug, description FROM categories WHERE category_id = $1;`, [
            categoryId,
        ])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Category Not Found'})
            }
            return rows[0] || null;
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