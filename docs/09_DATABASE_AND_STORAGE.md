# 09 Database and Storage: Persistent Memory

## Engine: Qdrant
Sanctum V1 uses **Qdrant** as its vector database engine. It was chosen for its high performance, native support for metadata filtering, and ease of local persistence.

## Persistence Model
The database is configured in **Local Persistent Mode**, meaning all indices, vectors, and payloads are stored on the disk of the host machine rather than in RAM alone.

*   **Storage Path:** `backend/data/qdrant_storage/`
*   **Collection Name:** `ramayana_v1`
*   **Vector Size:** 384 (MiniLM)

## Storage Components

### 1. Vector Store (Qdrant)
Stores the 384-dimensional embeddings of scriptural chunks alongside a JSON payload containing:
*   `text`: The primary passage.
*   `metadata`: Verse, chapter, Kanda, and source file.
*   `entities`: Pre-extracted lists of characters/locations.

### 2. Local Knowledge Files (JSON)
The "Symbolic Brain" of the system is stored in structured JSON files located in `backend/knowledge/`:
*   `entities.json`: Descriptions of divine beings.
*   `aliases.json`: Name variation mappings.
*   `relations.json`: The relationship graph for the Thread of Fate.
*   `dharma_lessons.json`: Moral mappings.

### 3. Local Logs (JSONL)
Query telemetry is stored in `backend/logs/observability.jsonl`. This acts as a lightweight audit trail for tracking:
*   User queries.
*   Intent classification accuracy.
*   Processing latency.
*   Retrieved entity coverage.

## Persistence Lifecycle
1.  **Ingestion:** The `IngestionPipeline` checks if `backend/data/qdrant_storage/` exists and contains points.
2.  **Idempotency:** If points are present, the heavy embedding process is skipped during server startup.
3.  **Search:** The `BrainAgent` initializes a persistent connection to the storage path.

## Why no ChromaDB?
While ChromaDB is a common choice, **Qdrant** was selected for Sanctum V1 because of its robust payload filtering capabilities (e.g., forcing a search for a specific character name), which is critical for the "Entity-First" retrieval strategy.
