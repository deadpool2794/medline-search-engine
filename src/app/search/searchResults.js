"use client";

import styles from "./SearchResults.module.css";

const SearchResults = ({ results }) => {
    if (!results || results.length === 0) {
        return <p>No results found.</p>;
    }
    console.log(results);
    return (
        <div className={styles.resultsContainer}>
            <h2 className={styles.heading}>Search Results</h2>
            {results?.map((result) => (
                <a
                    key={result.ID}
                    href={result.LINK_TO_MEDLINE_ARTICLE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resultCard}
                >
                    <h1 className={styles.resultTitle}>{result.TITLE}</h1>
                    <p className={styles.resultUrl}>{result.LINK_TO_MEDLINE_ARTICLE}</p>
                    <p className={styles.resultText}>{result.ARTICLE_DATA}</p>
                </a>
            ))}
        </div>
    );
};

export default SearchResults;
