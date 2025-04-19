const { getEventsByOrganisationId } = require('../controllers/organisations-controllers');
const { verifyToken } = require('../middleware/auth');

const organisationsRouter = require('express').Router();

organisationsRouter.route('/:organisation_id/events').get(verifyToken, getEventsByOrganisationId);

module.exports = organisationsRouter;
