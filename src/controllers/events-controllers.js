const { fetchEvents } = require('../models/events-models');

exports.getEvents = (request, response, next) => {
    fetchEvents()
        .then((events) => {
            response.status(200).send({ events });
        })
        .catch((err) => {
            next(err);
        });
};