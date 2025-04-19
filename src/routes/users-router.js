const { getLoggedInUser } = require('../controllers/users-controllers');
const { verifyToken } = require('../middleware/auth');

const usersRouter = require('express').Router();

usersRouter.route('/me')
    .get(verifyToken, getLoggedInUser);

module.exports = usersRouter;