import { Client } from '@elastic/elasticsearch';

export const PRODUCTS_INDEX = 'products';

export function createElasticsearchClient(url = process.env.ELASTICSEARCH_URL || 'http://localhost:9200') {
  return new Client({ node: url });
}

export const productMappings = {
  properties: {
    name: { type: 'text', fields: { keyword: { type: 'keyword' }, suggest: { type: 'search_as_you_type' } } },
    description: { type: 'text' },
    category: { type: 'keyword' },
    price: { type: 'float' },
    rating: { type: 'float' },
    tags: { type: 'text' },
    imageUrl: { type: 'keyword', index: false }
  }
};
