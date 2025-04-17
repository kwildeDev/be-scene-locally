const { getEvents, getEventById, postEvent, patchEvent } = require('../controllers/events-controllers');
const { postAttendee } = require('../controllers/attendees-controllers');

const eventsRouter = require('express').Router();

eventsRouter.route('/')
    .get(getEvents)
    .post(postEvent);

eventsRouter.route('/:event_id')
    .get(getEventById)
    .patch(patchEvent);

eventsRouter.route('/:event_id/attendees').post(postAttendee);

module.exports = eventsRouter;
