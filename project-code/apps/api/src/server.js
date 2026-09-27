import 'dotenv/config';
import { createApp } from './app.js';
import { createElasticsearchClient } from './elasticsearch.js';

const port = Number(process.env.PORT || 3001);
createApp(createElasticsearchClient()).listen(port, () => console.log(`API listening on http://localhost:${port}`));
