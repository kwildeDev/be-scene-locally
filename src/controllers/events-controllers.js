const { fetchEvents, fetchEventById, createEvent, updateEvent } = require('../models/events-models');

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
    const { organisation_id, ...dataToUpdate } = request.body
    if (organisation_id) {
        return Promise.reject({ status: 403, msg: 'Forbidden - you are not allowed to change the organisation ID'})
    }
    updateEvent(event_id, dataToUpdate)
        .then((event) => {
            response.status(200).send({ event });
        })
        .catch((err) => {
            next(err);
        });
};