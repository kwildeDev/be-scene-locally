const { fetchSubcategoriesByCategory, fetchSubcategoryById } = require('../models/subcategories-models');
const { fetchCategoryIdBySlug, fetchCategoryById } = require('../models/categories-models');

exports.getSubcategoriesForIdParent = (request, response, next) => {
    const categoryId = request.categoryId;
    if (!categoryId) {
        return response.status(400).send({ msg: 'Missing categoryID in request.' });
    }
    fetchCategoryById(categoryId)
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

exports.getSubcategoriesForSlugParent = (request, response, next) => {
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

exports.getSubcategoryById = (request, response, next) => {
    const { subcategoryId } = request.params;
    fetchSubcategoryById(subcategoryId)
        .then((subcategory) => {
            response.status(200).send({ subcategory });
        })
        .catch((err) => {
            next(err);
        });
};