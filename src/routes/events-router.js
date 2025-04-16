const { getEvents, getEventById } = require('../controllers/events-controllers');

const eventsRouter = require('express').Router();

eventsRouter.route('/').get(getEvents);

eventsRouter.route('/:event_id').get(getEventById)

module.exports = eventsRouter;
