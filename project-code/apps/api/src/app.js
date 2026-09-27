import cors from 'cors';
import express from 'express';
import { buildSearchRequest, buildSuggestionRequest, parseSearchQuery } from './search.js';

function unavailable(res) {
  return res.status(503).json({ error: 'Search service is unavailable. Start Elasticsearch and seed the product index.' });
}

export function createApp(client) {
  const app = express();
  app.use(cors());

  app.get('/api/health', async (_req, res) => {
    try {
      await client.ping();
      res.json({ status: 'ok', elasticsearch: 'connected' });
    } catch { unavailable(res); }
  });

  app.get('/api/search', async (req, res) => {
    const params = parseSearchQuery(req.query);
    if (params.error) return res.status(400).json({ error: params.error });
    try {
      const response = await client.search(buildSearchRequest(params));
      res.json({ total: typeof response.hits.total === 'number' ? response.hits.total : response.hits.total.value, results: response.hits.hits.map((hit) => ({ id: hit._id, score: hit._score, ...hit._source })) });
    } catch { unavailable(res); }
  });

  app.get('/api/suggestions', async (req, res) => {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ suggestions: [] });
    try {
      const response = await client.search(buildSuggestionRequest(q));
      const suggestions = [...new Set(response.hits.hits.map((hit) => hit._source.name))];
      res.json({ suggestions });
    } catch { unavailable(res); }
  });
  return app;
}
