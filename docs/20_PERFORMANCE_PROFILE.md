# 20 Performance Profile: Sanctum Benchmarks

## Overview
Sanctum V1 is optimized for high-density local retrieval. Benchmarks were conducted on a machine with 4 CPU cores and 8GB RAM.

## System Performance

| Metric | Measured Value | Target |
| :--- | :--- | :--- |
| **Ingestion Speed (Full Corpus)** | ~18 mins (80k points) | < 20 mins |
| **Embedding Speed** | ~75 chunks/sec | > 50 chunks/sec |
| **Retrieval Latency (Avg)** | 45ms | < 100ms |
| **Synthesis Latency (Avg)** | 120ms | < 200ms |
| **Total API Response Time** | ~170ms | < 350ms |
| **Initial Startup (Clean)** | ~25s | < 30s |
| **Subsequent Startup (Persistent)**| ~3s | < 5s |

## Data Footprint
*   **Vector Count:** 80,445 points
*   **Storage Size (Qdrant Disk):** ~1.2 GB
*   **Memory Usage (Peak Ingestion):** 2.4 GB
*   **Memory Usage (Idle API):** 1.1 GB

## Current Bottlenecks

### 1. Sequential UI Reveal (Intentional)
*   The "perceived" latency is high (~8.5 seconds) because of the meditative sequential reveal animations. This is a product choice, not a technical limitation.

### 2. SentenceTransformer Load
*   Loading the 384D MiniLM model on startup takes ~2 seconds.

### 3. CSV Parsing
*   The `CSVLoader` uses Pandas, which is memory-efficient but single-threaded. For corpora exceeding 1M rows, this would become a significant bottleneck.

### 4. BFS Relationship Search
*   For relationships beyond 2 degrees of separation, the in-memory BFS in `entity_extractor.py` shows slight overhead (~10ms). While negligible now, it won't scale for complex graph queries.

## Scalability Recommendations
*   **Parallel Embeddings:** Implement multi-processing for the `IngestionPipeline` to saturate multiple CPU cores during embedding generation.
*   **Qdrant Indexing:** Use HNSW indexing optimizations (currently defaults are used) to maintain < 50ms latency for collections > 500k points.
