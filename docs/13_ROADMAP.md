# 13 Roadmap: The Divine Evolution

## Current State: Sanctum V1 (Completed)
*   Unified ingestion of all repository data.
*   Persistent local vector storage (Qdrant).
*   Multi-agent orchestration (Factual, Moral, Personal).
*   Entity resolver and "Thread of Fate" pathfinding.
*   Sequential revelation UI with Sage Aura and Timeline Explorer.
*   Local observability logging.

---

## Sanctum V1.5: Resonance and Memory
*   **Multi-Turn Memory:** The Sage remembers the previous 3-5 exchanges to allow for follow-up questions.
*   **Verse Audio:** Integrate a lightweight TTS (Text-to-Speech) for the "Speaking" state of the Sage.
*   **Theme Extraction:** Implement an unsupervised theme extractor in the `KnowledgeBuilder` to automatically tag verses with concepts like "Sacrifice", "Betrayal", or "Devotion".
*   **Expanded Relationship Graph:** Add more complex relations (e.g., "Student of", "Enemy of") to the `relations.json` and improve the pathfinding grammar.

---

## Sanctum V2.0: Deep Mythology Intelligence
*   **The Knowledge Graph:** Transition from JSON-based relations to a proper Graph Database (like Neo4j) to allow for N-degree separation queries.
*   **Multi-Agent Reasoning:** Implement a "Council of Sages" where different agents discuss a moral dilemma before presenting the revelation.
*   **Refinement Layer:** Use an LLM (Gemini 1.5 Pro) to refine the synthesized responses, ensuring they are linguistically diverse while remaining grounded in the retrieved templates.
*   **Dynamic Timeline:** Allow users to click on any point in the Timeline to retrieve "Wisdom from this Kanda."

---

## Sanctum V3.0: Universal Mythology
*   **Cross-Epic Intelligence:** Ingest the Mahabharata and Puranas to find connections across different scriptural layers.
*   **Deep Reflection Memory:** Create a "Seeker's Profile" that tracks the user's journey through the Sanctum, suggesting verses based on their historical interests and emotional queries.
