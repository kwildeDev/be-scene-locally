const express = require('express');
const apiRouter = express.Router();
const endpoints = require('../endpoints.json');
const categoriesRouter = require('./categories-router');
const eventsRouter = require('./events-router');
const venuesRouter = require('./venues-router');
const usersRouter = require('./users-router');
const authRouter = require('./auth-router');

apiRouter.get('/', (request, response) => {
    response.status(200).send({ endpoints: endpoints });
});

apiRouter.use('/categories', categoriesRouter);

apiRouter.use('/events', eventsRouter);

apiRouter.use('/venues', venuesRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/auth', authRouter);

module.exports = apiRouter;
