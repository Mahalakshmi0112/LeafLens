const mongoose = require('mongoose');

async function health(req, res) { // eslint-disable-line no-unused-vars
  let mongo = 'offline';
  try {
    if (mongoose.connection.readyState === 1) mongo = 'online';
  } catch (error) {
    mongo = 'offline';
  }
  const connected = mongo === 'online';
  return res.status(connected ? 200 : 503).json({
    express: 'online',
    mongodb: mongo,
    status: connected ? 'ok' : 'degraded',
  });
}

module.exports = { health };
