const assert = require('node:assert/strict');
const http = require('node:http');
const mongoose = require('mongoose');
const { test } = require('node:test');
const { health } = require('../controllers/healthController');

async function withFastApi(statusCode, run) {
  const server = http.createServer((req, res) => {
    res.writeHead(statusCode);
    res.end('test response');
  });
  await new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', resolve);
    server.once('error', reject);
  });

  const originalReadyState = mongoose.connection.readyState;
  const originalFastApiUrl = process.env.FASTAPI_URL;
  process.env.FASTAPI_URL = `http://127.0.0.1:${server.address().port}`;
  try {
    await run();
  } finally {
    mongoose.connection.readyState = originalReadyState;
    if (originalFastApiUrl === undefined) delete process.env.FASTAPI_URL;
    else process.env.FASTAPI_URL = originalFastApiUrl;
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

async function invokeHealth() {
  let statusCode;
  let body;
  await health({}, {
    status(value) {
      statusCode = value;
      return this;
    },
    json(value) {
      body = value;
      return this;
    },
  });
  return { statusCode, body };
}

test('reports each service and keeps deployment healthy when FastAPI is online', async () => {
  await withFastApi(200, async () => {
    mongoose.connection.readyState = 1;
    const response = await invokeHealth();

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
      express: 'online',
      mongodb: 'online',
      fastapi: 'online',
      status: 'ok',
    });
  });
});

test('keeps deployment healthy and reports FastAPI offline when ML is unavailable', async () => {
  await withFastApi(503, async () => {
    mongoose.connection.readyState = 1;
    const response = await invokeHealth();

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, {
      express: 'online',
      mongodb: 'online',
      fastapi: 'offline',
      status: 'degraded',
    });
  });
});

test('returns 503 when MongoDB is disconnected even if FastAPI is online', async () => {
  await withFastApi(200, async () => {
    mongoose.connection.readyState = 0;
    const response = await invokeHealth();

    assert.equal(response.statusCode, 503);
    assert.equal(response.body.mongodb, 'offline');
    assert.equal(response.body.fastapi, 'online');
    assert.equal(response.body.status, 'degraded');
  });
});