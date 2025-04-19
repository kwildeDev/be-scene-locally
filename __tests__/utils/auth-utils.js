const jwt = require('jsonwebtoken');

function generateExpiredToken(user) {
  const payload = {
    userId: user.user_id,
    email: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: '0s',
  };

  const expiredToken = jwt.sign(payload, process.env.JWT_SECRET, options);
  return expiredToken;
}

module.exports = generateExpiredToken;