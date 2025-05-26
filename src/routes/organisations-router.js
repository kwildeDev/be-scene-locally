const { getEventsByOrganisationId, getTagsByOrganisationId } = require('../controllers/organisations-controllers');
const { verifyToken } = require('../middleware/auth');

const organisationsRouter = require('express').Router();

organisationsRouter.route('/:organisation_id/events').get(verifyToken, getEventsByOrganisationId);

organisationsRouter.route('/:organisation_id/tags').get(verifyToken, getTagsByOrganisationId);

module.exports = organisationsRouter;
