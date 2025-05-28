const { getCategories, getCategoryById } = require('../controllers/categories-controllers');
const subcategoriesRouter = require('./subcategories-router');

const categoriesRouter = require('express').Router();

categoriesRouter.route('/').get(getCategories);

categoriesRouter.get('/id/:categoryId', getCategoryById);

categoriesRouter.use('/id/:categoryId/subcategories',
    (request, response, next) => {
        const id = parseInt(request.params.categoryId, 10);
        if (isNaN(id)) {
            return response.status(400).json({ error: 'Invalid category ID' });
        }
        request.categoryId = id;
        next();
    },
    subcategoriesRouter
);

categoriesRouter.use(
    '/:categorySlug/subcategories',
    (request, response, next) => {
        request.categorySlug = request.params.categorySlug;
        next();
    },
    subcategoriesRouter
);

module.exports = categoriesRouter;
