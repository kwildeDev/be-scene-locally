const db = require('../../db/connection');

exports.fetchCategoryIdBySlug = (categorySlug) => {
    return db
        .query(`SELECT category_id FROM categories WHERE slug = $1;`, [
            categorySlug,
        ])
        .then(({ rows }) => {
            return rows[0] || null;
        });
};

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
