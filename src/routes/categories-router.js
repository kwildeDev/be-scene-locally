const { getCategories } = require('../controllers/categories-controllers');
const subcategoriesRouter = require('./subcategories-router');

const categoriesRouter = require('express').Router();

categoriesRouter.route('/').get(getCategories);

categoriesRouter.use(
    '/:categorySlug/subcategories',
    (request, response, next) => {
        request.categorySlug = request.params.categorySlug;
        next();
    },
    subcategoriesRouter
);

module.exports = categoriesRouter;
