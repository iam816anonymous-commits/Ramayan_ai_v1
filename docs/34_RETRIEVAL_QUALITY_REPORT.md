# 34 Retrieval Quality Report: V2.1 Hardening

## Overview
Phase 2 introduced a **Cross-Encoder Reranker** to the pipeline, transforming the standard vector search into a precision-focused hybrid engine.

## Metrics Improvement

| Metric | V1 Baseline | V2.1 Hardened | Status |
| :--- | :--- | :--- | :--- |
| **Top-1 Kanda Accuracy** | 16.7% | **33.3%** | Improved |
| **Top-5 Hit Rate** | 50.0% | **50.0%** | Stable |
| **Average Latency** | 0.29s | 0.63s | Acceptable |

## Implementation Proof
*   **Model:** `cross-encoder/ms-marco-MiniLM-L-6-v2`
*   **Workflow:**
    1.  Vector search returns top 10 candidates.
    2.  Cross-encoder scores query-text pairs.
    3.  Sort by rerank score.
    4.  Pass top 3 to the Sage.

## Discovery
The reranker is particularly effective at resolving "Exile" queries. In V1, "What was Rama's exile?" often returned general Rama trivia. In V2.1, the reranker prioritizes Ayodhya Kanda verses specifically detailing the departure to the forest.
