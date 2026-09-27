import { PRODUCTS_INDEX } from './elasticsearch.js';

const allowedSorts = new Set(['relevance', 'price-asc', 'price-desc']);

export function parseSearchQuery(query) {
  const q = String(query.q || '').trim();
  const category = String(query.category || '').trim();
  const sort = String(query.sort || 'relevance');
  const minPrice = query.minPrice === undefined || query.minPrice === '' ? undefined : Number(query.minPrice);
  const maxPrice = query.maxPrice === undefined || query.maxPrice === '' ? undefined : Number(query.maxPrice);

  if (!allowedSorts.has(sort)) return { error: 'sort must be relevance, price-asc, or price-desc.' };
  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) return { error: 'minPrice must be a non-negative number.' };
  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) return { error: 'maxPrice must be a non-negative number.' };
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) return { error: 'minPrice cannot be greater than maxPrice.' };
  return { q, category, sort, minPrice, maxPrice };
}

export function buildSearchRequest(params) {
  const filter = [];
  if (params.category) filter.push({ term: { category: params.category } });
  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    filter.push({ range: { price: { ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}), ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}) } } });
  }
  const query = params.q
    ? { bool: { must: [{ multi_match: { query: params.q, fields: ['name^4', 'tags^2', 'description'], type: 'best_fields', fuzziness: 'AUTO' } }], filter } }
    : { bool: { must: [{ match_all: {} }], filter } };
  const sort = params.sort === 'price-asc' ? [{ price: 'asc' }] : params.sort === 'price-desc' ? [{ price: 'desc' }] : ['_score'];
  return { index: PRODUCTS_INDEX, size: 100, query, sort };
}

export function buildSuggestionRequest(q) {
  return {
    index: PRODUCTS_INDEX,
    size: 6,
    _source: ['name'],
    query: { multi_match: { query: q, type: 'bool_prefix', fields: ['name.suggest', 'name.suggest._2gram', 'name.suggest._3gram'] } }
  };
}
