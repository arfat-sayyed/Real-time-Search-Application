import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';

const products = [
  { _id: '1', _score: 2, _source: { name: 'Wireless Headphones', category: 'Electronics', price: 79.99, rating: 4.5, tags: ['audio'] } },
  { _id: '2', _score: 1, _source: { name: 'Running Shoes', category: 'Sports', price: 64.99, rating: 4.4, tags: ['fitness'] } }
];
const client = {
  ping: async () => true,
  search: async (requestBody) => ({ hits: { total: { value: products.length }, hits: requestBody._source ? products.slice(0, 1) : products } })
};
async function withServer(app, action) {
  const server = app.listen(0);
  await once(server, 'listening');
  try { await action(server); } finally { server.close(); }
}

test('health reports a connected service', async () => {
  await withServer(createApp(client), async (server) => {
    const response = await request(server).get('/api/health');
    assert.equal(response.status, 200); assert.equal(response.body.status, 'ok');
  });
});

test('search returns product results', async () => {
  await withServer(createApp(client), async (server) => {
    const response = await request(server).get('/api/search?q=headphones&category=Electronics');
    assert.equal(response.status, 200); assert.equal(response.body.total, 2); assert.equal(response.body.results[0].name, 'Wireless Headphones');
  });
});

test('search rejects invalid price ranges', async () => {
  await withServer(createApp(client), async (server) => {
    const response = await request(server).get('/api/search?minPrice=100&maxPrice=10');
    assert.equal(response.status, 400); assert.match(response.body.error, /minPrice/);
  });
});

test('suggestions return product names', async () => {
  await withServer(createApp(client), async (server) => {
    const response = await request(server).get('/api/suggestions?q=wire');
    assert.equal(response.status, 200); assert.deepEqual(response.body.suggestions, ['Wireless Headphones']);
  });
});

test('unavailable Elasticsearch returns 503', async () => {
  const downApp = createApp({ ping: async () => { throw new Error('down'); }, search: async () => { throw new Error('down'); } });
  await withServer(downApp, async (server) => {
    const response = await request(server).get('/api/search?q=test');
    assert.equal(response.status, 503);
  });
});
