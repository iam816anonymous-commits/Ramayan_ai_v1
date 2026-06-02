# 15 Architectural Debt: Ramayana AI Audit

## Technical Debt and Code Smells

### 1. Hardcoded Poetic Transitions (Critical)
*   **Problem:** Poetic phrases (e.g., "The Thread of Fate reveals...", "In the depths of the sacred verses...") are hardcoded directly into `brain.py`.
*   **Impact:** Modifying the persona or translating the system into other languages requires code changes.
*   **Root Cause:** Rapid prototyping of the "Sage" persona.
*   **Recommended Fix:** Move all persona-specific strings to a `backend/knowledge/templates.json` file.

### 2. In-Memory BFS for Relationships (High)
*   **Problem:** Relationship pathfinding in `entity_extractor.py` uses an in-memory BFS on a flat JSON list.
*   **Impact:** Performance will degrade exponentially as the relationship graph grows.
*   **Root Cause:** Use of a simple JSON file instead of a Graph Database for V1.
*   **Recommended Fix:** Transition to a lightweight Graph DB like **FalkorDB** or **Neo4j**.

### 3. Client-Side Sequential Timing (High)
*   **Problem:** Revelation delays are hardcoded in `SanctumChat.tsx` via `REVELATION_TIMINGS` and `setTimeout`.
*   **Impact:** Inconsistent experience if the network is slow or the browser tab is throttled.
*   **Root Cause:** Front-end orchestration of meditative pacing.
*   **Recommended Fix:** Move reveal state management to a specialized hook or use a more robust animation library timeline.

### 4. Global `brain` Variable in `main.py` (Medium)
*   **Problem:** The `brain` agent is initialized as a global `None` and populated in `startup_event`.
*   **Impact:** Potential race conditions during rapid startup and difficult to unit test the API without global side effects.
*   **Root Cause:** Simplistic FastAPI startup pattern.
*   **Recommended Fix:** Use FastAPI's Dependency Injection system to manage the lifecycle of agents.

### 5. Simple Keyword-Based Intent Detection (Medium)
*   **Problem:** The `Orchestrator` uses basic string counting (`q.count("lost")`) to determine intent.
*   **Impact:** High risk of misclassification for complex queries.
*   **Root Cause:** Avoidance of LLM costs/latency for classification.
*   **Recommended Fix:** Implement a small, local classifier (e.g., BERT-based) for intent detection.

## Summary Table

| Issue | Classification | Recommended Fix |
| :--- | :--- | :--- |
| Hardcoded Persona | **Critical** | Externalize to `templates.json` |
| BFS Relationship Search | **High** | Transition to Graph DB |
| Browser-based pacing | **High** | Server-sent events or improved hooks |
| Global state in API | **Medium** | Use FastAPI Dependency Injection |
| Keyword Intent Detection | **Medium** | Local BERT Classifier |
| Error Handling (Generic 500) | **Low** | Structured error responses |
| Lack of Auth | **Low** | Add session-based tokens |
| Missing Ingestion Logging | **Low** | Add detailed ingestion telemetry |
