"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState();
    const router = useRouter();

    const searchDocs = () => {
        if (searchQuery === undefined || searchQuery.trim().length === 0) {
            alert("Please enter a search query.");
            return;
        }

        const trimmedQuery = searchQuery.trim();
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    };

    return (
        <div className={styles.container}>
            {/* Medline logo */}
            <div className={styles.logo}>
                <Image src="/logo.png" alt="medline Logo" width={382} height={92} />
            </div>

            {/* Search bar */}
            <div className={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Search Medline"
                    className={styles.searchInput}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search Medline"
                />
                <button type="button" className={styles.searchButton} onClick={searchDocs}>
                    Search
                </button>
            </div>
        </div>
    );
}
