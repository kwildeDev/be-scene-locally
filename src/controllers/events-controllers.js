const { fetchEvents, fetchEventById, createEvent, updateEvent, removeEvent } = require('../models/events-models');

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

exports.patchEvent = (request, response, next) => {
    const { event_id } = request.params
    const { organisation_id, status } = request.body
    const dataToUpdate  = { ...request.body };
    if (organisation_id || status === 'draft') {
        return Promise.reject({ status: 403, msg: 'Forbidden - certain fields cannot be updated'})
    }
    updateEvent(event_id, dataToUpdate)
        .then((event) => {
            response.status(200).send({ event });
        })
        .catch((err) => {
            next(err);
        });
};

exports.deleteEvent = (request, response, next) => {
    const { event_id } = request.params;
    removeEvent(event_id).then(() => {
        response.status(204).send();
    })
    .catch((err) => {
        next(err)
    });
};