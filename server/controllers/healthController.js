const mongoose = require('mongoose');
const axios = require('axios');

async function health(req, res) { // eslint-disable-line no-unused-vars
  let fastapi = 'offline';
  try {
    const response = await axios.get(`${(process.env.FASTAPI_URL || 'http://localhost:8000').replace(/\/$/, '')}/ping`, { timeout: 2000 });
    if (response.status >= 200 && response.status < 300) fastapi = 'online';
  } catch (error) {
    fastapi = 'offline';
  }
  const mongo = mongoose.connection.readyState === 1 ? 'online' : 'offline';
  const overall = mongo === 'online' && fastapi === 'online';
  return res.status(overall ? 200 : 503).json({ express: 'online', mongodb: mongo, fastapi, status: overall ? 'ok' : 'degraded' });
}

module.exports = { health };
