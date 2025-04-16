const { fetchVenues } = require('../models/venues-models');

exports.getVenues = (request, response, next) => {
    fetchVenues()
        .then((venues) => {
            response.status(200).send({ venues });
        })
        .catch((err) => {
            next(err);
        });
};