const express = require('express');
const apiRouter = express.Router();
const endpoints = require('../endpoints.json');
const categoriesRouter = require('./categories-router');
const eventsRouter = require('./events-router');
const venuesRouter = require('./venues-router');

apiRouter.get('/', (request, response) => {
    response.status(200).send({ endpoints: endpoints });
});

apiRouter.use('/categories', categoriesRouter);

apiRouter.use('/events', eventsRouter);

apiRouter.use('/venues', venuesRouter);

module.exports = apiRouter;
