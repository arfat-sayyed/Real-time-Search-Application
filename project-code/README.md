# Findly Real-Time Product Search

A simple MBA major-project demonstration of a real-time product search application built with React, Node.js, Express, and Elasticsearch. It contains 100 Indian-market demo products with prices in Indian rupees.

## What it demonstrates

- Debounced live search and autocomplete across all 100 catalog products
- Elasticsearch relevance ranking, fuzzy matching, category filters, and price filters
- React user interface and Express REST API
- Repeatable local setup with Docker Compose and a product seed script

## Prerequisites

- Node.js 20 or later
- pnpm 9 or later
- Docker Desktop (required only for Elasticsearch)

## One-command Docker demo (recommended for a teacher)

Install and open Docker Desktop first. Then open a terminal in this project folder and run:

```bash
docker compose up --build
```

Docker automatically starts Elasticsearch, indexes all 100 products, starts the Express API, and serves the React application. When the logs show `API listening`, open:

```text
http://localhost:8080
```

No Node.js, pnpm, environment file, or separate seed command is needed for this Docker method. To stop it, press `Ctrl + C`. To start it again later, use the same command. To remove the saved Elasticsearch data as well, run:

```bash
docker compose down -v
```

> To share the project, upload the complete project folder to GitHub or send it as a ZIP file. Your teacher downloads/clones it, opens Docker Desktop, and runs the single command above. A GitHub Pages link alone cannot run Docker containers.

## Run locally for development

```bash
pnpm install
cp .env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm elastic:up
pnpm seed
pnpm dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:3001` and Elasticsearch runs on `http://localhost:9200`.

To stop Elasticsearch, run `pnpm elastic:down`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run React and Express together |
| `pnpm elastic:up` | Start local Elasticsearch |
| `pnpm seed` | Create and fill the `products` index |
| `pnpm test` | Run API tests |
| `pnpm build` | Create a production web build |

## API

| Endpoint | Example | Purpose |
| --- | --- | --- |
| `GET /api/health` | `/api/health` | Check Elasticsearch connectivity |
| `GET /api/search` | `/api/search?q=wireless&category=Electronics` | Search and filter products |
| `GET /api/suggestions` | `/api/suggestions?q=wire` | Get autocomplete names |

Search also accepts `minPrice`, `maxPrice`, and `sort` (`relevance`, `price-asc`, or `price-desc`).

## Architecture

```text
Browser (React/Vite)
       | HTTP
Express API ------------------> Elasticsearch products index
       |                                  ^
       +--- validation, query builder ----+ seed script loads products.json
```

## Manual verification checklist

1. Search `wireless` and confirm wireless products appear.
2. Type `run` and choose the running-shoe autocomplete suggestion.
3. Select Sports and a maximum price of 50; confirm results narrow down.
4. Change sorting to price high-to-low.
5. Enter a minimum price higher than maximum price; confirm the API shows a clear validation message.
6. Stop Elasticsearch and refresh; confirm the UI shows an unavailable-service message.

## Optional temporary public demo

Use this only when needed for assessment. Deploy `apps/web` to Vercel and `apps/api` as a Render free web service, then set `VITE_API_URL` to the deployed API URL. Create an Elastic Cloud trial deployment and set the Render `ELASTICSEARCH_URL` secret to its HTTPS endpoint. Seed from a local machine while the trial is active. Elastic Cloud trials last 14 days, and a free Render service may sleep after 15 minutes without traffic; do not describe this as permanent hosting. [Elastic trial details](https://www.elastic.co/docs/get-started/evaluate-elastic) · [Render free-service behavior](https://render.com/docs/free)

## Troubleshooting

- **Docker command missing:** install and start Docker Desktop, then repeat `pnpm elastic:up`.
- **API says service unavailable:** wait for Elasticsearch to start, then run `pnpm seed`.
- **No results:** verify `pnpm seed` completed and visit `http://localhost:9200/products/_count`.
- **Frontend cannot reach API:** verify `apps/web/.env` has `VITE_API_URL=http://localhost:3001/api` and restart Vite.

## Screenshots to capture for submission

Capture the running search page, autocomplete dropdown, filtered results, API health response, Docker Elasticsearch container, and successful test output. Add those images later to the final report appendix with captions and source note: “Author’s screenshot.”
