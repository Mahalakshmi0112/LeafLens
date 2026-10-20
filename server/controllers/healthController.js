const mongoose = require('mongoose');
const axios = require('axios');

async function health(req, res) { // eslint-disable-line no-unused-vars
  let mongo = 'offline';
  try {
    if (mongoose.connection.readyState === 1) mongo = 'online';
  } catch {
    mongo = 'offline';
  }

  let fastapi = 'offline';
  try {
    const response = await axios.get(
      `${(process.env.FASTAPI_URL || 'http://localhost:8000').replace(/\/$/, '')}/ping`,
      { timeout: 2000 }
    );
    if (response.status >= 200 && response.status < 300) fastapi = 'online';
  } catch {
    fastapi = 'offline';
  }

  const connected = mongo === 'online';
  return res.status(connected ? 200 : 503).json({
    express: 'online',
    mongodb: mongo,
    fastapi,
    status: connected && fastapi === 'online' ? 'ok' : 'degraded',
  });
}

module.exports = { health };
