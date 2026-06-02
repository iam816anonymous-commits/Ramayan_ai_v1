## 2025-05-22 - [Batched Embedding Ingestion]
**Learning:** Batching `SentenceTransformer.encode()` calls provides a significant throughput increase (up to 6.6x in isolated benchmarks). However, when implementing batching in a pipeline that filters data (e.g., skipping empty strings), it is critical to use a stable ID counter (`current_id`) instead of relying on loop indices (`i + j`) to avoid ID shifting and metadata misalignment in the vector database.
**Action:** Always use a decoupled, monotonic counter for vector IDs when processing filtered batches to maintain data integrity.
