const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { fetchUserByEmail } = require('../models/users-models');

exports.loginUser = (request, response, next) => {
    const { email, password } = request.body;
    let fetchedUser;
    fetchUserByEmail(email)
        .then((user) => {
            if (!user) {
                return response.status(401).send({ msg: 'Invalid credentials' });
            }
            fetchedUser = user;
            return bcrypt.compare(password, user.password_hash);
        })
        .then((passwordMatch) => {
            if (!passwordMatch) {
                return response.status(401).send({ msg: 'Invalid credentials' });
            }
            const payload = { 
                                user_id: fetchedUser.user_id,
                                organisation_id: fetchedUser.organisation_id 
                            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            response.status(200).send({ token });
        })
        .catch((err) => {
            next(err);
        });
};