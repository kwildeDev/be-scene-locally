const { getSubcategories } = require('../controllers/subcategories-controllers');

const subcategoriesRouter = require('express').Router();

subcategoriesRouter.route('/').get(getSubcategories);

module.exports = subcategoriesRouter;
