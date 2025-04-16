const { createAttendee } = require('../models/attendees-models');

exports.postAttendee = (request, response, next) => {
    const { event_id } = request.params;
    const newAttendee = request.body;
    createAttendee(event_id, newAttendee)
        .then((attendee) => {
            response.status(201).send({ attendee });
        })
        .catch((err) => {
            next(err);
        });
};
