const express = require('express');
const apiRouter = express.Router();
const endpoints = require('../endpoints.json');
const categoriesRouter = require('./categories-router');
const subcategoriesRouter = require('./subcategories-router');

apiRouter.get('/', (request, response) => {
    response.status(200).send({ endpoints: endpoints });
});

apiRouter.use('/categories', categoriesRouter);

apiRouter.use('/subcategories', subcategoriesRouter);

module.exports = apiRouter;
