const authRouter = require('express').Router();
const { loginUser } = require('../controllers/auth-controllers');

authRouter.post('/login', loginUser);

module.exports = authRouter;