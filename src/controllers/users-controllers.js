const { fetchUserById } = require('../models/users-models');

exports.getLoggedInUser = (request, response, next) => {
    const authenticatedUserId = request.user.user_id;
    fetchUserById(authenticatedUserId)
        .then((user) => {
            if (!user) {
                return response.status(404).send({ msg: 'User Not Found' });
            }
            if (user.user_id !== authenticatedUserId) {
                return response.status(401).send({ msg: 'Unauthorized - Access Denied' });
            }
            response.status(200).send({ user });
        })
        .catch((err) => {
            next(err);
        });
};