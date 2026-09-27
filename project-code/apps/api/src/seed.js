import 'dotenv/config';
import { createElasticsearchClient, PRODUCTS_INDEX, productMappings } from './elasticsearch.js';
import products from '../../../data/indian-products.js';
const client = createElasticsearchClient();

if (products.length !== 100) throw new Error(`Expected 100 products, received ${products.length}.`);

await client.indices.delete({ index: PRODUCTS_INDEX, ignore_unavailable: true });
await client.indices.create({ index: PRODUCTS_INDEX, mappings: productMappings });
const operations = products.flatMap((product) => [{ index: { _index: PRODUCTS_INDEX, _id: product.id } }, product]);
const result = await client.bulk({ refresh: true, operations });
if (result.errors) throw new Error('Some products could not be indexed.');
console.log(`Indexed ${products.length} products into ${PRODUCTS_INDEX}.`);
