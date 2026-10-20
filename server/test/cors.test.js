const assert = require('node:assert/strict');
const { test } = require('node:test');

process.env.NODE_ENV = 'test';
process.env.CLIENT_ORIGIN = 'https://leaflens-web.vercel.app';
const app = require('../app');

const frontendOrigin = 'https://leaflens-web.vercel.app';

async function withServer(requests) {
  const server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
    instance.once('error', reject);
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  try {
    await requests(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
}

test('allows the deployed frontend origin on the health endpoint', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: frontendOrigin },
    });

    assert.equal(response.headers.get('access-control-allow-origin'), frontendOrigin);
    assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
  });
});

test('does not allow an unconfigured origin', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: 'https://not-leaflens.example' },
    });

    assert.equal(response.headers.get('access-control-allow-origin'), null);
  });
});

test('handles an authorized OPTIONS preflight request', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: frontendOrigin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization,content-type',
      },
    });

    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), frontendOrigin);
    assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
    assert.match(response.headers.get('access-control-allow-methods'), /POST/);
    assert.match(response.headers.get('access-control-allow-headers'), /authorization/i);
    assert.match(response.headers.get('access-control-allow-headers'), /content-type/i);
  });
});