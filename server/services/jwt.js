const jwt = require('jsonwebtoken');

function signUserToken(userId) {
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { signUserToken };
