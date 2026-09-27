# Real-time Search Application

This repository contains the Findly MBA major-project source code.

## Run the complete project with Docker

1. Install and open Docker Desktop.
2. Run these commands from the cloned repository:

```bash
cd project-code
docker compose up --build
```

3. Open http://localhost:8080 in a browser.

Docker starts Elasticsearch, seeds 100 Indian-market products, starts the Express API, and serves the React application automatically.

The detailed project documentation and development instructions are in [project-code/README.md](project-code/README.md).
