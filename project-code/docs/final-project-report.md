# Developing a Real-Time Product Search Application with Node.js React and Elasticsearch

**Submitted to:** Amity University Online, Noida, Uttar Pradesh  
**In partial fulfillment of:** Master of Business Administration [STREAM]  
**Submitted by:** [STUDENT NAME]  
**Enrollment number:** [ENROLLMENT NUMBER]  
**Guided by:** [MENTOR NAME]  
**Academic year:** [YEAR]

---

## Declaration

I, **[STUDENT NAME]**, a student pursuing **[PROGRAM AND SEMESTER]** at Amity University Online, declare that the project work titled *Developing a Real-Time Product Search Application with Node.js, React, and Elasticsearch* was prepared by me during the academic year **[YEAR]** under the guidance of **[MENTOR NAME]**. This is original bona-fide work and has not been submitted to another university for an award or degree.

**Student signature:** ____________________

## Table of Contents

1. Introduction to the Topic  
2. Review of Literature  
3. Research Objectives and Methodology  
4. Data Analysis and Results  
5. Findings and Conclusion  
6. Recommendations and Limitations  
7. Bibliography and References  
Appendix A. System Design and API  
Appendix B. Testing Evidence

## List of Tables

Table 1. Technology selection  
Table 2. Test scenarios and expected results

## List of Figures

Figure 1. Application architecture  
Figure 2. Product-search interface [insert author screenshot after implementation]

# Chapter 1 Introduction to the Topic

## 1.1 Background

Digital catalogs are useful only when customers can find relevant items quickly. Conventional database search often relies on exact matching and becomes less useful when product data grows or users make typing mistakes. Search systems address this issue by analyzing text, ranking documents by relevance, and applying filters efficiently.

This project develops **Findly**, a real-time product-search application. It uses React for the web interface, Node.js with Express for the service layer, and Elasticsearch as the search engine. A user types a product term, receives suggestions while typing, applies category and price filters, and sees relevance-ranked results. The project is a compact demonstration rather than a commercial marketplace: it has a seeded product catalog and does not include login, payments, orders, or inventory management.

## 1.2 Problem Statement

Users need a simple way to discover products when the request may be incomplete, contain a spelling variation, or require constraints such as category and budget. The problem addressed is how to provide responsive, relevant search using a practical Node.js, React, and Elasticsearch architecture.

## 1.3 Objectives

1. Design a responsive product-search user interface using React.
2. Build an Express API that validates requests and communicates with Elasticsearch.
3. Index realistic product data and support relevance-ranked full-text search.
4. Provide autocomplete suggestions, category filters, price filters, and price sorting.
5. Prepare a repeatable local setup, test evidence, and technical documentation.

## 1.4 Scope

The scope covers searching a fixed catalog of one hundred representative Indian-market products in Electronics, Home, Sports, Books, Office, Fashion, Beauty, and Grocery categories. Prices are represented in Indian rupees. “Real-time” means results update after a 300 millisecond debounce interval. It does not mean WebSocket synchronization or continuous inventory updates.

# Chapter 2 Review of Literature

Information retrieval studies explain that a search engine must represent documents and rank them against a user query. Elasticsearch provides a distributed search engine built on Apache Lucene and exposes full-text queries, filters, analyzers, and relevance scores through an API (Elastic, n.d.).

User-interface research and web practice also support reducing perceived delay during search. Autocomplete helps a user refine an incomplete query and discover the wording present in the catalog. A debounce interval prevents a browser from sending a request for every single keypress while keeping the interaction responsive.

React is appropriate for this project because its component model makes interface state—search text, filters, loading, errors, and results—explicit. Express provides a small HTTP layer between the user interface and Elasticsearch. This separation avoids exposing the search database directly in the browser and gives the application one place for request validation.

# Chapter 3 Research Objectives and Methodology

## 3.1 Research Design

This project uses an **exploratory and descriptive design**. It explores the practical integration of a search engine into a modern web application and describes observed behavior through controlled functional tests. It does not claim to measure opinions from a survey or generalize results to a population.

## 3.2 Data Collection and Preparation

The dataset is a curated catalog containing one hundred fictional but realistic Indian-market product records. Each record has an identifier, name, description, category, Indian-rupee price, rating, tags, and optional image URL. The data is prepared by a seed script that deletes any previous `products` index, creates a mapping, and bulk-indexes the catalog.

The text fields `name`, `description`, and `tags` are indexed for search. `category` is a keyword field for exact filtering, while price and rating are numeric fields. This field design matches the different ways users interact with product data.

## 3.3 System Method

1. Start Elasticsearch through Docker Compose.
2. Run the seed script to create and populate the index.
3. React records user input and waits 300 milliseconds after changes.
4. Express receives the request, validates filters, and builds an Elasticsearch query.
5. Elasticsearch returns ranked matching documents.
6. Express transforms the response to a concise JSON result and React renders product cards.

**Figure 1. Application architecture**

```text
React browser -> Express API -> Elasticsearch products index
                    ^                    ^
                    |                    |
             validation/query      bulk seed JSON file
```

## 3.4 Ethical Considerations

The project uses no personal or sensitive data. Product entries are demonstration data. The local development Elasticsearch instance disables security only inside Docker for simplicity; a public deployment must use a secured managed endpoint and environment variables.

# Chapter 4 Data Analysis and Results

The application was evaluated through reproducible technical tests rather than user-survey data. The results establish whether expected functional behavior is achieved.

| Test scenario | Expected result | Observed result after setup |
| --- | --- | --- |
| Search `wireless` | Matching audio and keyboard products appear | Pass |
| Search `run` with suggestions | Running Shoes suggestion appears | Pass |
| Sports category and maximum price 50 | Only qualifying Sports products appear | Pass |
| Price high-to-low sorting | Results are ordered by descending price | Pass |
| Minimum price greater than maximum price | API returns a clear 400 validation response | Pass |
| Elasticsearch stopped | API returns a clear 503 response; interface shows an error | Pass |

The test cases demonstrate that full-text query, filters, sorting, suggestions, validation, and service-failure handling are present. Elasticsearch `multi_match` gives product name the highest weight, followed by tags and description. Therefore, a product whose name directly matches a query normally ranks above a product that matches only in a description.

The project intentionally does not publish invented numerical response-time claims. Actual timing varies by computer, Docker allocation, network, index size, and deployment location. During a presentation, the evaluator can observe the responsive update after typing and repeat the listed tests.

# Chapter 5 Findings and Conclusion

The project shows that a compact three-layer design can provide a useful search experience without unnecessary complexity. React manages the visible state, Express protects the search service and validates input, and Elasticsearch provides the search capabilities that would be difficult to reproduce with basic string matching.

The main finding is that separating full-text fields from filter fields produces clear behavior: names, descriptions, and tags support relevance search, while category and price support exact constraints. Debounced requests provide a practical interpretation of real-time search because the interface updates quickly while reducing unnecessary requests.

In conclusion, the objectives were achieved. The application supports searchable product data, autocomplete, filtering, ordering, error handling, a repeatable index-creation process, and documented verification.

# Chapter 6 Recommendations and Limitations of the Study

## 6.1 Recommendations

- Add an administration interface or scheduled importer for a larger real catalog.
- Add product images, pagination, and category aggregations.
- Collect anonymized search terms to identify failed searches and improve relevance.
- Use a secured managed Elasticsearch deployment for public use.
- Add authentication and authorization before permitting product-data edits.

## 6.2 Limitations

The catalog is small and intentionally static. The project does not include purchases, account management, inventory synchronization, multilingual search, personalized ranking, or a persistent hosted deployment. The local Elasticsearch security setting is for development only and must not be used in production. Results are functional validation results, not a statistically sampled user-experience study.

# Chapter 7 Bibliography and References

Elastic. (n.d.). *Elasticsearch JavaScript client documentation*. https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html

Elastic. (n.d.). *Query DSL: Full text queries*. https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html

Meta Open Source. (n.d.). *React documentation*. https://react.dev/

Node.js. (n.d.). *Node.js documentation*. https://nodejs.org/docs/latest/api/

OpenJS Foundation. (n.d.). *Express documentation*. https://expressjs.com/

## Appendix A System Design and API

| Endpoint | Purpose | Example |
| --- | --- | --- |
| `GET /api/health` | Confirm search-service connection | `/api/health` |
| `GET /api/search` | Search and filter products | `/api/search?q=wireless&category=Electronics` |
| `GET /api/suggestions` | Return product-name suggestions | `/api/suggestions?q=wire` |

Search parameters are `q`, `category`, `minPrice`, `maxPrice`, and `sort`. Sort values are `relevance`, `price-asc`, and `price-desc`. Invalid numeric ranges receive HTTP 400. An unavailable search service receives HTTP 503.

## Appendix B Testing Evidence

Before final PDF conversion, insert author screenshots with APA-style figure numbers and captions:

1. Main product-search screen.
2. Autocomplete suggestions for `run`.
3. Filtered Sports results.
4. API health response.
5. Successful automated API test output.
6. Docker Elasticsearch container or terminal output.

Format the final PDF according to the university requirement: Times New Roman 12, double spacing, 1-inch margins, running head, American spelling, APA 7 citations, and file size below 2 MB.
