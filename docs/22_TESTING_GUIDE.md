# 22 Testing Guide: Sanctum Quality Assurance

## Overview
Sanctum V1 uses a layered testing strategy covering backend agents, retrieval accuracy, and frontend reveal sequences.

## 1. Unit Testing (Backend)
Tests individual agent logic and data loaders.
*   **Command:** `pytest backend/app/`
*   **Key Files:**
    *   `test_agents_v2.py`: Verifies Orchestrator routing and Sage formatting.
    *   `test_entity_layer.py`: Verifies alias resolution and BFS pathfinding.

## 2. Integration Testing (API)
Verifies the end-to-end flow from query to revelation.
*   **Command:**
    ```bash
    export PYTHONPATH=$PYTHONPATH:.
    python3 -m backend.app.main &
    # Run API tests using curl or a separate script
    ```

## 3. Retrieval Benchmark Strategy
Measures the relevance of search results against a golden dataset.
*   **Strategy:** Run the 50 queries defined in `18_RETRIEVAL_EVALUATION.md` and check if the `grounded` flag is correctly set and the primary character is present in `meta["entities"]`.

## 4. Frontend Verification (Playwright)
Since the UI relies heavily on staggered animations, visual verification is critical.
*   **Script:** `/home/jules/verification/verify_sanctum.py`
*   **Checks:**
    1.  Wait for "The Sage is contemplating" visibility.
    2.  Wait 15s to ensure all 4 revelation parts are visible.
    3.  Verify that clicking an entity button opens the Knowledge Modal.

## 5. Regression Test Strategy
Every new data source must be audited for:
1.  **Duplicate Check:** Ensure the point count doesn't increase by more than the file's line count.
2.  **Alias Breakage:** Ensure new data doesn't introduce conflicting names (e.g., a new "Vasistha" spelling) without updating `aliases.json`.

## Summary Table

| Layer | Tool | Purpose |
| :--- | :--- | :--- |
| **Logic** | Pytest | Agent synthesis & Extractor BFS |
| **Retreival** | Custom Script | Golden 50 query precision |
| **UI/UX** | Playwright | Meditative reveal timing |
| **Data** | Pandas/JSON | Ingestion normalization |
