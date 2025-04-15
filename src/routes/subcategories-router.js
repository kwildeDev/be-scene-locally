const { getSubcategoriesByCategory } = require('../controllers/subcategories-controllers');

const subcategoriesRouter = require('express').Router();

subcategoriesRouter.route('/').get((request, response, next) => {
    const categorySlug = request.categorySlug || request.params.categorySlug; 
    getSubcategoriesByCategory(request, response, next);
});

module.exports = subcategoriesRouter;
