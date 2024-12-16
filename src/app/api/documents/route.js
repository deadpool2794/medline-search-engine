import { createConnection } from "mysql2/promise";
import pluralize from "pluralize";
import stem from "stem-porter";
import { NextResponse } from "next/server";

const host = "localhost";
const user = "root";
const password = "password123";

// Tokenizer for cleaning and processing the text
export const tokenize = (text) => {
    // Step 1: Remove punctuation
    const cleanedText = text.replace(/[.?,:—]/g, " ").replace(/[\/#!$%\^&\*;{}=\-+_`~()"'|\[\]]/g, "");
    // Step 2: Convert text to lowercase
    const tokens = cleanedText.toLowerCase().split(/\s+/);

    // Step 3: Convert plurals to singular using pluralize
    const singularTokens = tokens.map((token) => pluralize.singular(token));
    // Step 4: Convert tokens to their normal form (Stemming)
    const normalizedTokens = singularTokens.map((token) => {
        return stem(token);
    });
    return normalizedTokens;
};

export const getTermFrequenciesFromDoc = (tokens) => {
    const frequencies = {};

    for (const item of tokens) {
        // Increment the count if the item exists, or initialize it to 1 if it doesn't
        frequencies[item] = (frequencies[item] || 0) + 1;
    }

    return frequencies;
};

const cosineNormalize = (vector) => {
    let norm = 0;
    for (let [key, value] of Object.entries(vector)) norm += value * value;
    if (norm === 0) return vector;
    norm = Math.sqrt(norm);
    for (let eachKey of Object.keys(vector)) {
        vector[eachKey] /= norm;
    }
    return vector;
};

const cosineSimilarityScore = (queryVector, docVector) => {
    let score = 0;
    for (let key of Object.keys(queryVector)) {
        score += queryVector[key] * docVector[key];
    }

    return score;
};

const getBestMatchingDocuments = async (userQuery, medlineDB) => {
    const queryTf = getTermFrequenciesFromDoc(tokenize(userQuery));
    const uniqueTokens = Object.keys(queryTf);
    const allDocIds = (await medlineDB.query(`SELECT DISTINCT(DOC_ID) FROM INVERTED_INDEX_TABLE`))[0];
    const docIds = allDocIds.map((eachDoc) => eachDoc.DOC_ID);
    const N = docIds.length;
    const queryVector = {};
    const idf = {};
    for (let token of uniqueTokens) {
        // Calculating query tf
        const frequency_raw = queryTf[token];
        const tf = 1 + Math.log10(frequency_raw);

        // Calculating idf values
        const query = `SELECT DOC_FREQUENCY FROM DICTIONARY_TABLE WHERE TERM = '${token}'`;
        const result = await medlineDB.query(query);
        let docFrequency;
        if (result[0].length == 0) {
            docFrequency = N;
        } else {
            docFrequency = result[0][0]["DOC_FREQUENCY"];
        }
        idf[token] = Math.log10(N / docFrequency);
        const tfidfWeighting = tf * idf[token];
        queryVector[token] = tfidfWeighting;
    }
    console.log(queryVector);
    const docVectors = {};

    const queryResult = (
        await medlineDB.query(`SELECT DOC_ID, TERM, TERM_FREQ
                    FROM INVERTED_INDEX_TABLE
                    WHERE TERM in (${uniqueTokens.map((token) => "'" + token + "'")})`)
    )[0];

    for (let eachRecord of queryResult) {
        if (docVectors[eachRecord.DOC_ID] === undefined) {
            docVectors[eachRecord.DOC_ID] = {};
            for (let token of uniqueTokens) docVectors[eachRecord.DOC_ID][token] = 0;
        }
        docVectors[eachRecord.DOC_ID][eachRecord.TERM] = (1 + Math.log10(eachRecord.TERM_FREQ)) * idf[eachRecord.TERM];
    }
    console.log(docVectors);
    const normalizedQueryVector = cosineNormalize(queryVector);
    const scores = {};
    for (let key of Object.keys(docVectors)) {
        docVectors[key] = cosineNormalize(docVectors[key]);
        scores[key] = cosineSimilarityScore(normalizedQueryVector, docVectors[key]);
    }
    console.log(scores);
    const sortedScores = Object.entries(scores).sort(([, valueA], [, valueB]) => valueB - valueA);
    // const startIndex = p * pagesPerDoc;
    // const endIndex = p * pagesPerDoc + pagesPerDoc;
    const results = sortedScores.map((score) => score[0]);
    return results;
};

export const GET = async (params) => {
    const { url } = params;
    const searchParams = new URL(url).searchParams;
    const queryParams = {};
    for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
    }

    const { q } = queryParams;

    try {
        const medlineDB = await createConnection({ host, user, password, database: "MEDLINEDB" });
        const results = await getBestMatchingDocuments(q, medlineDB);

        const links = (await medlineDB.query(`SELECT ID, TITLE, LINK_TO_MEDLINE_ARTICLE, ARTICLE_DATA FROM MEDLINEDATA;`))[0];

        const Objs = links.map((link) => {
            const obj = { ...link };
            obj.ARTICLE_DATA = obj.ARTICLE_DATA.slice(0, 300) + "...";
            return obj;
        });

        const sortedObjects = results.map((pId) => {
            return Objs.find((obj) => obj.ID == pId);
        });

        await medlineDB.close();
        return NextResponse.json(sortedObjects);
    } catch (err) {
        console.log(err.message);
        return NextResponse.json({ error: err.message });
    }
};
