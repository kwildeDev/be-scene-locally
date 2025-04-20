const { fetchSubcategoriesByCategory } = require('../models/subcategories-models');
const { fetchCategoryIdBySlug } = require('../models/categories-models');
const app = require('../app');

exports.getSubcategoriesByCategory = (request, response, next) => {
    const categorySlug = request.params.categorySlug || request.categorySlug;
    if (!categorySlug) {
        return response.status(400).send({ msg: 'Missing categorySlug in request' });
    }
    fetchCategoryIdBySlug(categorySlug)
        .then((category) => {
            return fetchSubcategoriesByCategory(category.category_id);
        })
        .then((subcategories) => {
            response.status(200).send({ subcategories });
        })
        .catch((err) => {
            next(err);
        });
};
