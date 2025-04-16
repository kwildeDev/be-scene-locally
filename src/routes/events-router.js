const { getEvents } = require('../controllers/events-controllers');

const eventsRouter = require('express').Router();

eventsRouter.route('/').get(getEvents);

module.exports = eventsRouter;
