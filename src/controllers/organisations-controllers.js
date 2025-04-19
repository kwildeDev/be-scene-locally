const { fetchEventsByOrganisationId } = require('../models/organisations-models');

exports.getEventsByOrganisationId = (request, response, next) => {
    const { organisation_id } = request.params;
    const authenticatedOrgId = request.user.organisation_id
    if (!Number.isInteger(Number(organisation_id))) {
        return next({ status: 400, msg: 'Bad Request' });
    }
    if (Number(organisation_id) !== authenticatedOrgId) {
        return next({ status: 403, msg: 'Forbidden - Access Denied'});
    }
    fetchEventsByOrganisationId(organisation_id)
        .then((events) => {
            response.status(200).send({ events });
        })
        .catch((err) => {
            next(err);
        });
};