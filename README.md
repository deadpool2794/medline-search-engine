# Medline Search Engine

## Overview

The **Medline Search Engine** is a specialized search platform designed for querying and retrieving information exclusively from the MedlinePlus dataset. It mimics the functionality of general-purpose search engines like Google but is tailored for Medline data. It efficiently calculates relevance scores for user queries using **TF-IDF** and **Cosine Similarity**, providing the most relevant results from the knowledge base.

## Features

- **Data Scraped from MedlinePlus**: The dataset includes comprehensive health-related information.
- **Inverted Index**: Efficient data indexing for rapid query processing.
- **TF-IDF Score Calculation**: Evaluates term relevance in both user queries and documents.
- **Cosine Similarity**: Measures similarity between the query and all documents in the knowledge base.
- **Top Results Retrieval**: Displays the best-matching documents for user queries.
- **Modern UI**: Built with **Next.js** for a fast and responsive user experience.

## Technical Details

1. **Data Indexing**:
   - Scraped all content from the MedlinePlus website.
   - Created an inverted index for efficient term lookups.

2. **Query Processing**:
   - Tokenizes user queries.
   - Calculates **TF-IDF** scores for query terms and document terms.
   - Computes **Cosine Similarity** to rank documents by relevance.

3. **Results Presentation**:
   - Displays the most relevant documents in order of similarity score.

## Prerequisites

- **Node.js** (v14.x or later)
- **npm** or **yarn**

## Getting Started

1. **Extract the Project Archive**:
   ```bash
   unzip medline-search-engine.zip
   cd medline-search-engine
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Enter a query related to Medline data in the search bar.
2. The engine computes TF-IDF and Cosine Similarity scores.
3. Top matching documents are displayed, ranked by relevance.


## Technology Stack

- **Frontend**: Next.js
- **Backend**: Node.js
- **Data Storage**: MySQL
- **Algorithm**: TF-IDF and Cosine Similarity for ranking documents

---
**Author**: Alim Khan Abdul  
```  
