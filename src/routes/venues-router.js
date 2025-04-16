const { getVenues } = require('../controllers/venues-controllers');

const venuesRouter = require('express').Router();

venuesRouter.route('/').get(getVenues);

module.exports = venuesRouter;