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

Digital product catalogues are now a common part of online retail, educational demonstrations, and internal business systems. Their usefulness depends not only on how many items they store, but also on how easily a user can locate a relevant item. A visitor rarely remembers every exact product name. Instead, the visitor may enter a broad term such as “wireless,” a partial phrase such as “head,” a category requirement such as Electronics, or a budget requirement such as less than ₹2,000. A basic list or a conventional exact-match search gives limited assistance in these situations. The user may need to inspect many records manually, and a small typing difference can lead to an empty result.

Search technology addresses this problem by treating product information as searchable text rather than as a set of isolated fields. A search engine can analyse product names, descriptions, and tags; identify likely matches; rank the matches; and combine textual matching with precise constraints such as category or price. Elasticsearch is built for this type of full-text retrieval and provides query, filter, and ranking features through an application programming interface (Elastic, n.d.). These capabilities are valuable whenever the user experience depends on discovering an item quickly rather than browsing a long unstructured catalogue.

The present project develops **Findly**, a real-time product-search application. The application uses React for the web interface, Node.js with Express for the server-side API, and Elasticsearch for indexing and retrieval. A user types a product term and receives updated results after a short delay. The user can see product-name suggestions, narrow the results with category and price filters, and choose relevance-based or price-based ordering. The product cards present a name, short description, category, price in Indian rupees, and rating. The application is intentionally designed as a compact academic demonstration rather than a commercial marketplace: it has a seeded catalogue and does not include login, payments, orders, inventory management, or customer accounts.

The term “real-time” in this project refers to live interaction in the browser. The interface waits for 300 milliseconds after a change in the search text before it sends a request. This short debounce interval avoids making a request for every key press while still making the results feel immediate to the user. It is important to define this term clearly. The project does not use WebSockets, continuous data synchronisation, or live inventory feeds. Instead, it demonstrates responsive search and autocomplete over a prepared product index.

The project also demonstrates a practical separation of responsibilities. React controls the visible interface state, including the search field, suggestions, filters, loading message, error message, and product cards. Express provides a controlled API between the browser and the search engine. Elasticsearch stores the searchable index and returns ranked documents. This separation keeps Elasticsearch credentials and query construction out of the browser, makes validation possible in one location, and allows each layer to be explained independently during evaluation.

## 1.2 Problem Statement

Users need a simple way to discover products when their request may be incomplete, contain a spelling variation, or require constraints such as category and budget. In a static catalogue, the user may need to browse many product cards before finding an appropriate item. In an exact-match search implementation, a product may not be returned when the wording in the query differs from the wording stored in the catalogue. For example, a user interested in a keyboard may search for “wireless”, “mechanical”, or “office accessory”. A useful system should understand these words in relation to the product text and should present the most relevant options before less relevant ones.

The central problem addressed by this study is therefore how to provide responsive and relevant product discovery through a simple, understandable web architecture. The solution must accept free-text queries, support category and price constraints, offer suggestions for incomplete input, and communicate clear feedback when an invalid filter or unavailable search service prevents a normal result. It must also be practical to set up on a local computer for an academic demonstration.

The problem has both a technical and a user-experience dimension. Technically, the application needs an index with appropriate field types, a query that combines matching and filtering, and an API that validates incoming parameters. From the user-experience perspective, the interface should not require a separate search button for every query, should make available choices visible, and should not leave the user with an unexplained blank screen. The project investigates these requirements through a working prototype and controlled functional tests rather than through an opinion survey.

## 1.3 Justification for Selection of the Topic

The topic was selected because product search is a clear business problem that connects customer convenience with modern information-retrieval technology. Almost every organisation that maintains a catalogue, whether it sells consumer products, books, office supplies, or internal assets, needs users to find items efficiently. A product-search application is therefore a suitable MBA major-project domain: it has a visible business purpose, measurable functional requirements, and a realistic technology implementation.

The topic is also appropriate for studying the role of search quality in digital experiences. A user may leave a catalogue if relevant products are difficult to find or if filtering is slow and confusing. Conversely, useful suggestions and accurate filters can reduce the effort required to explore the catalogue. The project does not claim to measure sales conversion or customer satisfaction. Instead, it demonstrates the system features that support product discovery and records whether those features work under reproducible test conditions.

Elasticsearch was selected because it provides a focused way to study full-text search, relevance scoring, and structured filtering. Recreating these capabilities with only manual string comparisons would make the implementation less realistic and would shift attention away from the search-engine concepts. React was selected for a responsive component-based interface, while Express was selected for a small and readable server layer. React documentation describes its model for building user interfaces from components, and Express provides a lightweight approach for defining HTTP routes and middleware (Meta Open Source, n.d.; OpenJS Foundation, n.d.). Together, these technologies make the project practical for both implementation and viva explanation.

The Indian product context was selected to make the data and interface more familiar to the intended academic audience. The demonstration catalogue contains one hundred representative items across Electronics, Home, Sports, Books, Office, Fashion, Beauty, and Grocery categories. Prices are displayed in Indian rupees. The records are fictional demonstration data, so the project does not represent live market prices, actual stock, or a commercial seller’s inventory.

## 1.4 Project Overview

Findly is implemented as a monorepo containing a frontend application, a backend API, shared project documentation, and a data folder. The frontend is a React application created with Vite. It presents the search box, autocomplete list, category selector, minimum and maximum price inputs, sorting selector, product grid, and status messages. The backend is a Node.js application using Express. It exposes endpoints for a health check, product search, and suggestions. The Elasticsearch service runs in Docker during local demonstration, and a seed script creates the `products` index and bulk-loads the catalogue.

The search process begins when a user changes the text or a filter in the interface. After the debounce interval, React sends an HTTP request to the Express API. The API checks numeric filter values and creates an Elasticsearch request. The request uses text matching across the name, description, and tags fields, applies category and price filters when selected, and applies the chosen sorting behaviour. Elasticsearch returns matching documents and scores. The API returns a concise JSON response, and React renders the product cards. Suggestions follow a similar route but return a small distinct list of matching product names.

The system includes clear service-failure handling. If a price range is invalid, the API returns a 400 response with a readable message. If Elasticsearch cannot be reached, the API returns a 503 response instead of exposing a technical stack trace. The frontend converts these responses into an error state. This behaviour is useful in a demonstration because it shows that the project considers exceptional conditions as well as successful searches.

## 1.5 Aim and Objectives of the Study

The aim of this project is to design and develop a real-time product-search application that demonstrates relevance-ranked search, autocomplete, filtering, and clear user feedback using Node.js, React, and Elasticsearch.

The specific objectives are as follows:

1. Design a responsive product-search user interface using React.
2. Build an Express API that validates requests and communicates with Elasticsearch.
3. Index realistic product data and support relevance-ranked full-text search.
4. Provide autocomplete suggestions, category filters, price filters, and price sorting.
5. Prepare a repeatable local setup, test evidence, and technical documentation.

## 1.6 Research Questions

The project is guided by the following practical questions:

1. How can a React interface provide live product-search results without sending an unnecessary request for every keystroke?
2. How can an Express API safely validate search parameters and communicate with Elasticsearch?
3. How can product text, category, and price be modelled so that relevance search and exact filtering work together?
4. Can a simple local Docker setup create a repeatable academic demonstration of the complete application?

These questions are answered through implementation and functional verification. They are not used to test a statistical hypothesis or to make claims about a wider population of users.

## 1.7 Scope and Delimitations

The scope covers searching a fixed catalogue of one hundred representative Indian-market products in Electronics, Home, Sports, Books, Office, Fashion, Beauty, and Grocery categories. Each product has an identifier, name, description, category, price, rating, tags, and optional image URL. Prices are represented in Indian rupees. The interface supports a free-text query, autocomplete suggestions, category selection, minimum and maximum prices, relevance ordering, and price ordering.

The technical scope includes a React frontend, an Express API, Elasticsearch, a product seed process, API tests, and Docker Compose for local execution. The local Docker configuration starts Elasticsearch, indexes the demonstration data, starts the API, and serves the frontend through one browser address. This makes the project reproducible for a teacher who has Docker Desktop installed.

Several boundaries are deliberately kept outside the scope. The system does not include user registration, authentication, a shopping cart, payment processing, order fulfilment, supplier integration, inventory updates, recommendations based on personal history, multilingual analysis, or a production administration panel. It does not connect to a real e-commerce database. The dataset remains static except when the seed script is run again. These delimitations keep the project focused on the defined search problem and prevent unrelated commercial features from obscuring the core learning objectives.

## 1.8 Significance of the Study

The project is significant as a practical illustration of how a search engine can improve the retrieval of catalogue information. It shows the difference between presenting all records and helping a user narrow the catalogue through text relevance and structured filters. The application also illustrates that good search behaviour is not produced by a single technology alone. The database or search engine, backend validation, frontend interaction design, and deployment setup each contribute to the final experience.

For academic learning, the project brings together concepts from web development, information retrieval, data modelling, and software testing. It provides direct examples of an index mapping, bulk indexing, a multi-field search query, a debounce function, REST endpoints, HTTP status codes, and Docker-based reproducibility. These are concrete topics that can be demonstrated during a viva rather than described only in theory.

For a business audience, the prototype demonstrates a pattern that can be extended. A larger organisation could replace the demonstration catalogue with a managed product feed, add secure credentials, measure unsuccessful searches, and tune relevance according to business priorities. Those enhancements are future possibilities, not claims about the current prototype. The current study establishes the basic search workflow first.

## 1.9 Organisation of the Report

This report is organised into eight chapters. Chapters 1 to 6 introduce the topic, review literature, explain the methodology, report the functional-test observations, present findings and conclusions, and state recommendations and limitations. Chapter 7 provides the bibliography. Chapter 8 contains the appendices: the API summary, testing evidence, deployment notes, and screenshots of the completed application.

## 1.10 Chapter Summary

This chapter established the need for a responsive product-search experience and defined the project as a focused implementation of live search, autocomplete, filtering, and relevance ranking. Findly uses a prepared catalogue of one hundred Indian-market demonstration products and a three-layer React, Express, and Elasticsearch architecture. The next chapter reviews the concepts and technologies that support this approach.

# Chapter 2 Review of Literature

Information retrieval studies explain that a search engine must represent documents and rank them against a user query. Standard information-retrieval texts describe indexing, query processing, and ranking as the core activities that make large collections searchable (Manning et al., 2008; Baeza-Yates & Ribeiro-Neto, 2011). Elasticsearch provides a distributed search engine built on Apache Lucene and exposes full-text queries, filters, analyzers, and relevance scores through an API (Elastic, n.d.).

Search-interface literature emphasizes that an interface should help users express information needs, formulate queries, and understand results (Hearst, 2009). In this project, autocomplete helps a user refine an incomplete query and discover the wording present in the catalogue. A debounce interval prevents a browser from sending a request for every single keypress while keeping the interaction responsive.

React is appropriate for this project because its component model makes interface state—search text, filters, loading, errors, and results—explicit. Express provides a small HTTP layer between the user interface and Elasticsearch. This separation avoids exposing the search database directly in the browser and gives the application one place for request validation.

# Chapter 3 Research Objectives and Methodology

## 3.1 Research Objectives

The research objectives state the outcomes that this project is intended to achieve. The project focuses on the design and verification of a working search application rather than on measuring public opinion through a questionnaire. The objectives are:

1. To design a responsive React interface that provides live product search, autocomplete suggestions, category filtering, price filtering, and sorting.
2. To develop a Node.js and Express API that validates search parameters and communicates securely with Elasticsearch.
3. To create and index a representative catalogue of one hundred Indian-market demonstration products with searchable text and filterable numeric fields.
4. To evaluate whether search, suggestions, filters, sorting, validation, and unavailable-service handling work correctly through controlled functional tests.
5. To provide a Docker-based local setup that enables the application to be reproduced for academic demonstration.

## 3.2 Research Problem

The research problem is how to make a product catalogue easy to search when users enter incomplete, broad, or differently worded product queries and may also need to restrict the result by category or price. A simple exact-match approach does not adequately support relevance ranking, suggestions, or combined text and numeric filtering. The project therefore examines how a React, Express, and Elasticsearch architecture can provide a responsive and understandable product-discovery workflow.

## 3.3 Research Design

This project uses an **exploratory and descriptive design**. It explores the practical integration of a search engine into a modern web application and describes observed behavior through controlled functional tests. It does not claim to measure opinions from a survey or generalize results to a population.

The exploratory aspect is appropriate because the project investigates how Elasticsearch search features can be integrated into a small web application. The descriptive aspect is appropriate because the resulting behaviour is recorded as observable outcomes: whether appropriate results appear, whether filters narrow the result set, whether sorting changes the order, and whether invalid or unavailable conditions return clear responses.

## 3.4 Type of Data Used

The study uses both primary project data and secondary technical data. Primary project data consists of the one hundred fictional product records, the index created from those records, the API responses, and the results of controlled functional tests. Each product record contains an identifier, name, description, category, Indian-rupee price, rating, tags, and an optional image URL.

Secondary data consists of official technical documentation for Elasticsearch, React, Node.js, and Express. These sources provide the conceptual background for full-text search, client-server interaction, component-based interfaces, and HTTP APIs. No personal data, customer records, transaction data, or survey responses are used.

## 3.5 Data Collection Method

The product catalogue was prepared as a structured demonstration dataset and stored in a project data file. A seed script reads the data, removes any prior `products` index, creates the Elasticsearch mapping, and bulk-indexes the one hundred records. This method ensures that the same dataset can be recreated whenever the project is installed on another computer.

Functional observations were collected by running predefined search scenarios after the Docker services and index were available. The scenarios included a text search, autocomplete request, category and price filtering, price sorting, invalid price validation, and Elasticsearch-unavailable handling. The recorded outcome for each scenario was Pass when the observed response matched the expected behaviour.

## 3.6 Data Collection Instrument

The instruments used for data collection were the structured product-data file, the Elasticsearch index mapping, the Express API endpoints, the automated API test suite, and a manual browser verification checklist. The product-data file provided the catalogue records. The API endpoints produced JSON responses for health, search, and suggestions. Automated tests and the checklist were used to record whether each functional requirement was achieved.

No questionnaire, interview schedule, or rating scale was used because the study does not collect human-subject responses. The relevant evidence is generated through application execution and reproducible technical testing.

## 3.7 Sample Size

The study does not use a survey sample. Its analytical dataset contains **100 product records**, which form the complete demonstration catalogue indexed by Elasticsearch. The functional evaluation uses **six predefined test scenarios**: keyword search, autocomplete, category and price filtering, price sorting, invalid-range validation, and service-unavailable handling. These values describe the project dataset and verification set; they should not be interpreted as a sample of consumers or businesses.

## 3.8 Sampling Technique

Purposive, criterion-based selection was used to prepare the demonstration catalogue. Products were selected to cover eight categories—Electronics, Home, Sports, Books, Office, Fashion, Beauty, and Grocery—and to include varied names, tags, prices, and ratings. This variation is necessary to exercise the intended search features, including multi-field text matching, autocomplete, category filtering, and price-range filtering.

The functional scenarios were also selected purposively. Each scenario represents one required system behaviour or an important failure case. The selection is therefore appropriate for a prototype evaluation, but it is not probability sampling and does not support population-level statistical inference.

## 3.9 Data Analysis Tool

Elasticsearch is the principal data-retrieval and analysis tool in the application. It indexes the product text and produces relevance-ranked results using a multi-field search query. It also applies exact category filters and numeric price-range filters. The Express API validates query parameters and transforms Elasticsearch output into concise JSON responses.

For verification, the Node.js test runner and API tests check response status codes, response shape, filters, sorting, suggestions, and unavailable-service handling. Docker Compose is used to reproduce the runtime environment. The analysis is descriptive: observed application behaviour is compared with the expected behaviour for each scenario rather than being analysed with statistical software.

## 3.10 Data Preparation and System Method

The text fields `name`, `description`, and `tags` are indexed for search. `category` is a keyword field for exact filtering, while price and rating are numeric fields. This field design matches the different ways users interact with product data.

### System Workflow

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

## 3.11 Ethical Considerations

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

## 5.1 Findings

The functional results show that the planned search workflow was implemented successfully. The application returned matching products for a keyword search, offered product-name suggestions for incomplete input, applied category and price restrictions, and changed the order of results when price sorting was selected. These observations demonstrate that the frontend, API, and Elasticsearch index communicate as one working system rather than as separate components.

A second finding concerns the data model and relevance behaviour. Product names, descriptions, and tags are treated as full-text fields, while category and price are treated as structured filter fields. This separation allows the application to answer two different user needs at the same time: a user can discover relevant products through text matching and can also apply precise constraints such as a selected category or price range. The observed search results support the decision to use Elasticsearch rather than simple client-side string filtering for this project.

A third finding concerns usability and reliability. The 300-millisecond debounce delay allows the search interface to update after typing without sending a request for every character. Autocomplete provides a visible route from an incomplete phrase to a product name in the catalogue. The validation test confirmed that an invalid price range receives a clear HTTP 400 response, while the unavailable-service test confirmed that an Elasticsearch outage receives a clear HTTP 503 response. These outcomes show that the project accounts for error states as well as normal search results.

The Docker-based setup is an additional practical finding. Elasticsearch, data indexing, the Express API, and the React application can be started in a repeatable local environment. The seed process indexed all 100 demonstration products, making the test data available without manual database entry. This setup is particularly suitable for an academic demonstration because it reduces configuration steps and makes the architecture visible to the evaluator.

## 5.2 Conclusion

The aim of the project was to design and develop a real-time product-search application using Node.js, React, and Elasticsearch. The evidence recorded in Chapter 4 indicates that this aim was achieved for the defined prototype scope. The project supports searchable product data, relevance-ranked results, autocomplete suggestions, category and price filters, sorting, error handling, and a repeatable indexing process.

The project also demonstrates that a compact three-layer architecture is sufficient for a useful product-discovery experience. React manages what the user sees and interacts with, Express provides validation and an API boundary, and Elasticsearch provides search and filtering capabilities. Each layer has a defined responsibility, which makes the application easier to explain, test, and extend.

The conclusion is limited to the implemented prototype. The results are controlled functional-test observations, not evidence of market share, customer satisfaction, sales conversion, or performance at commercial scale. However, the project establishes a sound base for future enhancements such as real product feeds, authentication, product images, analytics of failed searches, multilingual search, and a secured hosted deployment.

# Chapter 6 Recommendations and Limitations of the Study

## 6.1 Recommendations

1. Add an administration interface so authorized users can create, update, and remove product records without editing the seed JSON file directly.
2. Create a scheduled or event-based importer to keep the Elasticsearch index synchronized with a larger real product catalogue.
3. Add product images, brand information, stock status, and product-detail links so that search results provide richer decision support.
4. Introduce pagination or infinite scrolling to keep the interface usable when the catalogue grows beyond the current demonstration dataset.
5. Use Elasticsearch aggregations to show category counts, price ranges, and other filter summaries alongside search results.
6. Record anonymized search terms and zero-result queries so that catalogue gaps and relevance problems can be identified without collecting personal data.
7. Review field boosts and synonym rules after observing real search behaviour; for example, related product names and common Indian spelling variations can be mapped together.
8. Add spelling tolerance and typo handling through Elasticsearch analyzers or query options to improve discovery when users enter incomplete or incorrect terms.
9. Add authentication and role-based authorization before allowing any product-data changes, administrative actions, or analytics access.
10. Deploy Elasticsearch in a secured managed environment for public use, with credentials, encrypted communication, backups, and restricted network access.
11. Add automated end-to-end tests that verify the browser interface, API, and Elasticsearch behaviour together after each release.
12. Monitor API errors, Elasticsearch health, and index size so that service issues can be detected and resolved before they affect users.

## 6.2 Limitations

1. The current catalogue contains 100 demonstration products and is intentionally smaller than a commercial product database.
2. Product information is static seed data; the prototype is not connected to a live retailer, inventory system, supplier feed, or database management system.
3. Prices are shown in Indian rupees for demonstration and are not live market prices, discounts, tax values, or delivery charges.
4. The application supports product discovery only. It does not include a shopping cart, payment processing, order placement, customer accounts, or order tracking.
5. Relevance scoring uses a practical fixed query configuration and has not yet been tuned from a large set of real user searches.
6. The prototype does not currently include multilingual search, personalized ranking, voice search, or advanced accessibility testing.
7. Elasticsearch security is disabled only in the local Docker configuration to simplify academic demonstration; this configuration is unsuitable for public production deployment.
8. The evaluation consists of controlled functional tests, not a statistically sampled survey of customer satisfaction, sales conversion, or commercial-scale performance.

# Chapter 7 Bibliography

## Research Papers

Robertson, S. E., & Zaragoza, H. (2009). The probabilistic relevance framework: BM25 and beyond. *Foundations and Trends in Information Retrieval, 3*(4), 333-389. https://doi.org/10.1561/1500000019

## Books

Baeza-Yates, R., & Ribeiro-Neto, B. (2011). *Modern information retrieval: The concepts and technology behind search* (2nd ed.). Addison-Wesley.

Hearst, M. A. (2009). *Search user interfaces*. Cambridge University Press. https://doi.org/10.1017/CBO9781139644082

Manning, C. D., Raghavan, P., & Schutze, H. (2008). *Introduction to information retrieval*. Cambridge University Press. https://doi.org/10.1017/CBO9780511809071

## Official Websites and Documentation

Elastic. (n.d.). *Elasticsearch JavaScript client documentation*. https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html

Elastic. (n.d.). *Query DSL: Full text queries*. https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html

Meta Open Source. (n.d.). *React documentation*. https://react.dev/

Node.js. (n.d.). *Node.js documentation*. https://nodejs.org/docs/latest/api/

OpenJS Foundation. (n.d.). *Express documentation*. https://expressjs.com/

# Chapter 8 Appendix

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
