# 19 Hallucination Guards: Sacred Truth

## Grounding Pipeline
The Sanctum prevents AI hallucinations through a strict deterministic pipeline rather than relying on LLM-based probability.

### 1. Context Validation
*   **Logic:** Every response must be derived from one of the ~80,000 retrieved chunks.
*   **Verification:** `BrainAgent.synthesize_response` checks the length and confidence of the `context` list.

### 2. The Grounding Flag
*   **Implementation:** `meta["grounded"]` is set to `False` if no high-confidence results are found.
*   **Action:** The UI then renders the "Sacred Silence" template.

## Known Hallucination Risks

### 1. Cross-Epic Contamination
*   **Risk:** The system answering questions about the Mahabharata using only Ramayana context (e.g., calling Krishna a brother of Rama).
*   **Actual Protection:** The `EntityExtractor` only contains Ramayana-specific canonical names. If "Krishna" is queried, it doesn't match an entity, and semantic search scores remain low, triggering the grounding flag.

### 2. Entity Confusion (Bali vs Vali)
*   **Risk:** Confusing King Bali (the demon from the Vamana avatar story) with Vali (the monkey king).
*   **Actual Protection:**
    *   `aliases.json` maps "bali" to "Vali" for the primary Kishkindha context.
    *   Metadata for "Bala Kanda" specifically tags "Vamana" and the demon "Bali" separately.
    *   The system uses the retrieved `kanda` metadata to disambiguate.

### 3. "Sage" Speculation
*   **Risk:** The Sage making up life advice not found in scriptures.
*   **Actual Protection:** The `MoralAgent` uses a pre-vetted list of `dharma_lessons.json`. It only adapts the *phrasing* (replacing pronouns with character names) rather than inventing new teachings.

## Fallback Responses
If grounding fails, the Sage provides one of the following deterministic responses:
*   *"The sacred silence holds all answers."*
*   *"Even when the path is not immediately clear, Dharma guides us."*
*   *"The vastness of the Ramayana contains infinite wisdom beyond this moment."*

## Detection Summary
| Failure Mode | Detection | Handling |
| :--- | :--- | :--- |
| **No Retrieval** | `len(context) == 0` | Sacred Silence |
| **Low Confidence** | Semantic score < 0.4 | Grounded: False |
| **Out-of-Scope** | Entity not in registry | Semantic Fallback |
| **Epic Overlap** | High cross-entropy keywords | Grounded check |
