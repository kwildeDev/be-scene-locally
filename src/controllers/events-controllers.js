const { fetchEvents, fetchEventById, createEvent } = require('../models/events-models');

exports.getEvents = (request, response, next) => {
    fetchEvents()
        .then((events) => {
            response.status(200).send({ events });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getEventById = (request, response, next) => {
    const { event_id } = request.params;
    fetchEventById(event_id)
        .then((event) => {
            response.status(200).send({ event });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postEvent = (request, response, next) => {
    const newEvent = request.body
    createEvent(newEvent)
        .then((event) => {
            response.status(201).send({ event });
        })
        .catch((err) => {
            next(err);
        });
};