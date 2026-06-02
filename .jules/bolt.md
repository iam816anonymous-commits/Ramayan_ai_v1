## 2025-05-22 - [Optimized Ingestion Pipeline with Batch Embeddings]
**Learning:** Batching calls to `SentenceTransformer.encode()` provides a significant speedup (measured at ~3.38x) compared to individual calls. This is due to internal vectorization and reduced overhead of model invocation.
**Action:** Always prefer batching for bulk operations like data ingestion or processing large lists of texts.
