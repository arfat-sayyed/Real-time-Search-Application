# Viva Guide for Findly Real-Time Product Search

## 30-second introduction

My project is a real-time product search application called Findly. It lets a user search a catalog while typing, choose autocomplete suggestions, filter by category and price, and sort results. React builds the interface, Node.js and Express provide the API, and Elasticsearch searches and ranks the products. I selected this design because Elasticsearch is better suited than simple text matching for full-text search, fuzzy matching, and relevance scoring.

## Architecture in simple words

```text
User types in React -> React calls Express -> Express queries Elasticsearch -> results return to React
```

- **React:** shows the search box, filters, suggestions, results, loading state, and errors.
- **Express:** receives browser requests, validates input, creates safe Elasticsearch queries, and returns JSON.
- **Elasticsearch:** stores the product index and finds the most relevant matching documents.
- **Docker Compose:** starts Elasticsearch locally in one repeatable command.
- **Seed script:** reads `data/products.json` and inserts it into Elasticsearch.

## Demonstration steps

1. Start Docker Desktop.
2. In the project folder, run `pnpm elastic:up`, then `pnpm seed`, then `pnpm dev`.
3. Open `http://localhost:5173`.
4. Search **wireless**. Explain that Elasticsearch matches the product fields and ranks names strongly.
5. Type **run**. Select **Running Shoes Breeze** from autocomplete.
6. Choose **Sports** and set a maximum price of **50**.
7. Change sort to **Price: high to low**.
8. Explain that invalid price ranges receive a 400 error, while an unavailable Elasticsearch service returns 503.

## Important concepts to remember

| Term | Simple explanation |
| --- | --- |
| Index | Like a database table designed for search. Here it is named `products`. |
| Document | One stored product record. |
| Mapping | Defines each field type, such as text, keyword, or number. |
| Full-text search | Finds meaningful matching words in fields such as name and description. |
| Relevance score | Elasticsearch value used to rank likely matches first. |
| `multi_match` | Searches several fields in one query. |
| Filter | Narrows results without changing text relevance, such as category or price. |
| Debounce | Waits 300 ms after typing before making a request. |
| Bulk indexing | Adds many seed records efficiently in one request. |

## Likely viva questions and answers

### Why did you choose Elasticsearch?

It supports full-text search, relevance ranking, fuzzy matching, filtering, and autocomplete-oriented mappings. These features are more appropriate for product discovery than a simple SQL `LIKE` query or JavaScript string comparison.

### What makes the project real-time?

The interface listens to every input change and updates search results after a short 300 ms debounce. It is near-real-time search, not real-time inventory synchronization through WebSockets.

### Why is there an Express backend instead of connecting React directly to Elasticsearch?

The backend keeps Elasticsearch connection details out of the browser, validates filter values, controls the permitted queries, and gives the frontend a small stable API.

### How does autocomplete work?

After the user types text, React calls `/api/suggestions`. The backend uses a `bool_prefix` query against the `search_as_you_type` subfield of the product name and returns up to six distinct product names.

### How are search results ranked?

The API uses `multi_match`. Product name has the highest boost, tags have a medium boost, and descriptions have lower priority. Elasticsearch calculates `_score` and results are shown in score order unless the user selects price sorting.

### Why are category and price fields modeled differently from name?

Name is text because it needs word analysis. Category is a keyword because it needs exact filtering. Price is float because it needs numeric range filtering and numeric sorting.

### How do you handle errors?

The API returns 400 for invalid filter input such as minimum price greater than maximum price. If Elasticsearch cannot be reached, it returns 503 with an understandable message. The React interface displays this message.

### What are the project limitations?

The data is static and small. There are no user accounts, payments, inventory updates, images from a storage service, analytics, or permanent cloud hosting. Local Elasticsearch security is disabled only to keep student setup simple.

### How would you scale the project?

I would host the API and frontend separately, use a secured managed Elasticsearch cluster, ingest real product changes through an admin pipeline, add pagination and aggregations, monitor failed searches, and improve relevance from real query data.

## Things not to say

- Do not say it uses WebSockets; it does not.
- Do not claim response-time numbers unless you measured them on the current machine.
- Do not call local security-disabled Elasticsearch production-ready.
- Do not say the product data comes from real customers; it is a curated demonstration dataset.

## Before the viva

- Replace all report placeholders with your real details.
- Run the complete setup once from a fresh terminal.
- Capture the screenshots listed in `README.md`.
- Read the report’s objectives, results, limitations, and recommendations aloud.
- Keep Docker Desktop open and Elasticsearch running during the demo.
