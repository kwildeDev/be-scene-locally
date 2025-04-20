const { fetchEvents, fetchEventById, createEvent, updateEvent, removeEvent } = require('../models/events-models');
const { fetchEventAttendees } = require('../models/attendees-models');
const { fetchCategoryIdBySlug } = require('../models/categories-models');

exports.getEvents = (request, response, next) => {
    const { sort_by, order, category } = request.query;
    const promises = [fetchEvents(sort_by, order, category)]
    if (category) {
        promises.push(fetchCategoryIdBySlug(category))
    }
    Promise.all(promises)
        .then((results) => {
            const events = results[0]
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

exports.getEventAttendees = (request, response, next) => {
    const { event_id } = request.params;
    const { organisation_id } = request.user;
    fetchEventAttendees(event_id, organisation_id)
        .then((attendees) => {
            response.status(200).send({ attendees });
        })
        .catch((err) => {
            next(err);
        })
}

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