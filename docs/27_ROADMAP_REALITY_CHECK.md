# 27 Roadmap Reality Check: Verified Path

## Milestone 1: V1 Stability (Current)
*   **Target:** 100% Retrieval reliability for primary entities.
*   **Priority:** High.
*   **Status:** Verified.

## Milestone 2: V1.5 Resonance and Polish
*   **Feature 1: Auto-scrolling Journey.** Ensure the `Timeline` component centers the active Kanda card automatically.
*   **Feature 2: Poetic Template Registry.** Move hardcoded strings from `brain.py` to `templates.json` to allow for easy persona tuning.
*   **Feature 3: multi-word Alias detection.** Improve `entity_extractor.py` to better handle names with spaces without relying on simplistic regex.

## Milestone 3: V2.0 Intelligence Scale
*   **Feature 1: Graph DB Integration.** Replace BFS search with **Neo4j** or **FalkorDB** to support n-degree relationship discovery.
*   **Feature 2: Conversational Memory.** Implement a thread-safe local session cache to allow for follow-up questions (e.g., "And what about his brother?").
*   **Feature 3: Unsupervised Theme Extraction.** Use a lightweight clustering model to populate the currently empty `theme` metadata field for the 80k points.

## Ranked Work by Impact

1.  **Graph DB Migration:** Unlocks the full power of "Thread of Fate" (Critical).
2.  **Conversational Memory:** Makes the Sage feel like a teacher rather than a search engine (High).
3.  **Theme Extraction:** Allows the Seeker to explore by topic (e.g., "Find me verses about Sacrifice") (Medium).
4.  **UI Polish (Scrolling):** Essential for mobile UX (Medium).
