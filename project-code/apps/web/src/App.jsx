import { useEffect, useState } from 'react';

// Docker uses the same origin and Nginx proxies /api to Express. The environment
// value keeps the normal Vite development workflow unchanged.
const API_URL = import.meta.env.VITE_API_URL || '/api';
const categories = ['All', 'Electronics', 'Home', 'Sports', 'Books', 'Office', 'Fashion', 'Beauty', 'Grocery'];
const formatPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function ProductCard({ product }) {
  return <article className="product-card">
    <div className="product-image">{product.imageUrl ? <img src={product.imageUrl} alt="" /> : '◈'}</div>
    <div className="product-copy"><span className="category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-footer"><strong>{formatPrice.format(product.price)}</strong><span>★ {product.rating.toFixed(1)}</span></div></div>
  </article>;
}

export default function App() {
  const [q, setQ] = useState(''); const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(''); const [maxPrice, setMaxPrice] = useState(''); const [sort, setSort] = useState('relevance');
  const [results, setResults] = useState([]); const [total, setTotal] = useState(0); const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      const params = new URLSearchParams({ q, sort });
      if (category !== 'All') params.set('category', category); if (minPrice) params.set('minPrice', minPrice); if (maxPrice) params.set('maxPrice', maxPrice);
      try { const response = await fetch(`${API_URL}/search?${params}`, { signal: controller.signal }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setResults(data.results); setTotal(data.total); }
      catch (err) { if (err.name !== 'AbortError') setError(err.message || 'Unable to load products.'); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 300);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [q, category, minPrice, maxPrice, sort]);

  useEffect(() => {
    if (!q.trim()) return setSuggestions([]);
    const controller = new AbortController();
    const timer = setTimeout(async () => { try { const response = await fetch(`${API_URL}/suggestions?q=${encodeURIComponent(q)}`, { signal: controller.signal }); const data = await response.json(); setSuggestions(data.suggestions || []); } catch { setSuggestions([]); } }, 300);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [q]);

  function chooseSuggestion(value) { setQ(value); setSuggestions([]); }
  function clearFilters() { setQ(''); setCategory('All'); setMinPrice(''); setMaxPrice(''); setSort('relevance'); }
  return <main>
    <section className="hero"><div className="shell"><p className="eyebrow">ELASTICSEARCH POWERED</p><h1>Find what fits your day.</h1><p className="hero-copy">A fast product discovery demo with live search, autocomplete, filters, and relevance scoring.</p><div className="search-wrap"><label htmlFor="product-search" className="sr-only">Search products</label><input id="product-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “wireless headphones”" autoComplete="off" />{suggestions.length > 0 && <ul className="suggestions">{suggestions.map((item) => <li key={item}><button onClick={() => chooseSuggestion(item)}>{item}</button></li>)}</ul>}</div></div></section>
    <section className="shell content"><aside className="filters"><div className="filter-title"><h2>Filters</h2><button onClick={clearFilters}>Reset</button></div><label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><div className="price-row"><label>Min price<input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="₹0" /></label><label>Max price<input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="₹10,000" /></label></div></aside>
      <section className="results"><div className="results-heading"><p>{loading ? 'Searching products…' : `${total} product${total === 1 ? '' : 's'} found`}</p><label>Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="relevance">Best match</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div>{error && <div className="message error">{error}</div>}{!loading && !error && results.length === 0 && <div className="message">No matching products. Try a different keyword or remove a filter.</div>}<div className="grid">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    </section><footer>Findly demo · Node.js · React · Elasticsearch</footer>
  </main>;
}
