const { getEvents, getEventById, getEventAttendees, postEvent, patchEvent, deleteEvent } = require('../controllers/events-controllers');
const { postAttendee } = require('../controllers/attendees-controllers');
const { verifyToken } = require('../middleware/auth');

const eventsRouter = require('express').Router();

eventsRouter.route('/')
    .get(getEvents)
    .post(postEvent);

eventsRouter.route('/:event_id')
    .get(getEventById)
    .patch(patchEvent)
    .delete(deleteEvent);

eventsRouter.route('/:event_id/attendees')
    .get(verifyToken, getEventAttendees)
    .post(postAttendee);

module.exports = eventsRouter;
