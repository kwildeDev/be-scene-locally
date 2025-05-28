const { fetchCategories, fetchCategoryById } = require('../models/categories-models');

exports.getCategories = (request, response, next) => {
    fetchCategories()
        .then((categories) => {
            response.status(200).send({ categories });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getCategoryById = (request, response, next) => {
    const { categoryId } = request.params;
    fetchCategoryById(categoryId)
        .then((category) => {
            response.status(200).send({ category });
        })
        .catch((err) => {
            next(err);
        });
};