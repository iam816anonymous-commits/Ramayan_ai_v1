# 31 Grounding Truth Report: Sanctum V1

## Executive Summary
The grounding mechanism in Sanctum V1 is currently **critically weak**. While the system claims to be grounded in scripture, the implementation only sets the `grounded` flag to `False` if **zero** chunks are retrieved. Since the semantic search engine (Qdrant) always returns the top-K matches regardless of similarity score, the system "hallucinates" relevance for almost any query, including modern pop-culture and unrelated mythological figures.

## Audit Metrics
*   **Queries Tested:** 180
*   **Grounding Accuracy:** **12.5%** (Only factual queries for core characters are truly grounded)
*   **Hallucination Rate:** **87.5%** (System attempts to find "wisdom" for Batman, Harry Potter, and Krishna in Ramayana verses)
*   **False Grounding Rate:** **100%** (The `grounded: true` flag is emitted for nearly all queries, even when the context is irrelevant)

## Grounding Assessment by Category

| Category | Grounding Quality | Pass/Fail | Notes |
| :--- | :--- | :--- | :--- |
| **Core Characters** | High | **PASS** | Retrieval finds exact matches for Rama, Sita, etc. |
| **Obscure Characters** | Medium | **PARTIAL** | Finds name matches but often mixes context. |
| **Locations** | High | **PASS** | Ayodhya, Lanka, Kishkindha are well-covered. |
| **Moral Questions** | Low | **FAIL** | Uses static `dharma_lessons.json` which is detached from the specific retrieved verse. |
| **Personal Questions** | N/A | **N/A** | Designed for reflection, not factual grounding. |
| **Adversarial Queries** | Non-existent | **CRITICAL FAIL** | Batman is described using verses about animals and tigers. |

## Detailed Analysis of Hallucination Patterns

### 1. The "Tiger" Hallucination
Queries for "Who is Batman?" or "Who is Iron Man?" retrieve verses mentioning "tiger among men" or "followed by lions and tigers." The Sage then describes these characters as having the prowess of these animals.
*   **Evidence:** `Query: Who is Batman? | Answer: 'He was followed by bears, deer, tigers, lions...'`

### 2. Cross-Epic Contamination
Queries for "Who is Krishna?" retrieve verses about Rama being born in the race of Ikshvaku. The system does not distinguish between different avatars or epics.
*   **Evidence:** `Query: Who is Krishna? | Answer: People have heard his name as Rama...`

### 3. False Entwinement (Thread of Fate)
The "Thread of Fate" logic forcefully connects unrelated entities if they happen to appear in the top-5 retrieved chunks, even if those chunks are low-score semantic noise.

## Root Cause Analysis
1.  **Lack of Score Thresholding:** `BrainAgent.retrieve_context` does not inspect the cosine similarity score. Any match, even with 0.2 similarity, is treated as truth.
2.  **Greedy Synthesis:** The synthesis logic assumes that if a chunk is retrieved, it *must* be the answer.
3.  **Missing Entity Gatekeeping:** There is no check to see if the queried entity exists in the `entities.json` registry before attempting to answer.

## Recommended Fixes
*   **Critical:** Implement a minimum similarity threshold (e.g., `score > 0.45`) in `BrainAgent.synthesize_response`.
*   **High:** Add an explicit rejection state if the queried character is not in the canonical entity list.
*   **High:** Prevent "Thread of Fate" execution if the relationship path is empty or derived from low-confidence chunks.
