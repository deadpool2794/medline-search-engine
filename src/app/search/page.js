"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import SearchResults from "./searchResults";

const Search = () => {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const p = searchParams.get("p");

    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const data = await fetch(`/api/documents?q=${encodeURIComponent(q)}&p=${p}`);
                const jsonResponse = await data.json();
                setResponse(jsonResponse);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, [q]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <div>
                <SearchResults results={response} />
            </div>
        </div>
    );
};

export default Search;
