const db = require('../../db/connection');

exports.fetchSubcategoriesByCategory = (categoryId) => {
    return db
        .query(
            `SELECT category_id, subcategory_id, name, slug, description FROM subcategories WHERE category_id = $1 ORDER BY name ASC;`,
            [categoryId]
        )
        .then(({ rows }) => {
            return rows;
        });
};

// used for events
exports.fetchSubcategoryIdBySlug = (category_id, subcategorySlug) => {
    return db
        .query(`SELECT subcategory_id FROM subcategories WHERE category_id = $1 AND slug = $2;`, [
            category_id, subcategorySlug,
        ])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Subcategory Not Found'})
            }
            return rows[0] || null;
        });
};

exports.fetchSubcategoryById = (subcategoryId) => {
    return db
        .query(
            `SELECT category_id, subcategory_id, name, slug, description FROM subcategories WHERE subcategory_id = $1;`,
            [subcategoryId]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Subcategory Not Found'})
            }
            return rows[0] || null;
        });
};