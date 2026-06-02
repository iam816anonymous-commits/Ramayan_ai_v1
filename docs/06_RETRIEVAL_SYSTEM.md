# 06 Retrieval System: The Divine Threads

## Retrieval Process
Retrieval in Sanctum V1 is a multi-stage process designed to ensure both accuracy and scriptural depth.

### Stage 1: Entity Extraction
The system first scans the query for known divine entities (Characters, Locations, Events) using `EntityExtractor.py`.

### Stage 2: Hybrid Search
The `BrainAgent` executes two types of lookups in Qdrant:
1.  **Exact Entity Filter:** If "Rama" is detected, it forces a retrieval of chunks where `character == "Rama"`.
2.  **Semantic Search:** It encodes the query into a 384D vector and performs a cosine similarity search across the entire corpus.

### Stage 3: Deduplication and Synthesis
Results from both stages are merged and deduplicated based on the verse and text content. The top `k=5` results are passed to the synthesis layer.

## Context Synthesis
The `BrainAgent` uses "poetic transitions" to merge disparate verses:
*   *Default:* "The sacred verses reveal..."
*   *Character-Match:* "The role of [Character] is further illuminated in the following verses..."
*   *Thread of Fate:* Used when two characters are queried. It calculates the path (e.g., Angada → Son Of → Vali) and presents it as an entwined destiny.

## Entity Resolution (Aliases)
One of the core strengths of the knowledge layer is resolving spelling variations across different translations:

| Variation | Canonical Name |
| :--- | :--- |
| **Bali / Vali** | Vali |
| **Angada / Angadha** | Angada |
| **Vasistha / Vasista / Vasishtha** | Vasishtha |

**Implementation:**
The `EntityExtractor` uses an `aliases.json` registry to normalize inputs before searching. This prevents fragmented results where "Bali" results might miss "Vali" context.

## Hallucination Prevention (Grounding)
The `BrainAgent` performs a grounding check:
*   If the retrieval returns 0 results or low-confidence scores, the response is flagged in the metadata as `grounded: false`.
*   The `SageAgent` then provides a "Sacred Silence" response: *"Even when the path is not immediately clear, Dharma guides us."*

## Current Limitations
*   **Context Window:** Synthesis currently only uses the top 5 chunks.
*   **Relationship Depth:** The "Thread of Fate" pathfinding is limited to 2 degrees of separation to avoid nonsensical connections.
*   **Cross-Translation Conflicts:** If two translations of the same verse differ significantly, the current reranking logic simply picks the highest semantic score.
