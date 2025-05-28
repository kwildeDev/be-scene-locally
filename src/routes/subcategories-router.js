const { getSubcategoriesForIdParent, getSubcategoriesForSlugParent, getSubcategoryById } = require('../controllers/subcategories-controllers');

const subcategoriesRouter = require('express').Router();

subcategoriesRouter.route('/').get((request, response, next) => {
    if (request.categoryId) {
        getSubcategoriesForIdParent(request, response, next);
    } else if (request.categorySlug) {
        getSubcategoriesForSlugParent(request, response, next);
    } else {
        response.status(400).json({ error: 'Missing parent category identifier for subcategories.' });
    }
});

subcategoriesRouter.get('/:subcategoryId',
    (request, response, next) => {
        const id = parseInt(request.params.subcategoryId, 10);
        if (isNaN(id)) {
            return response.status(400).json({ error: 'Invalid subcategory ID. Must be a number.' });
        }
        request.subcategoryId = id;
        next();
    },
    getSubcategoryById
);

module.exports = subcategoriesRouter;
