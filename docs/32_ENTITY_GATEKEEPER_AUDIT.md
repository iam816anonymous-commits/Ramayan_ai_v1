# 32 Entity Gatekeeper Audit: Adversarial Resistance

## Overview
The "Entity Gatekeeper" is intended to protect the Sanctum from answering questions about modern pop culture, unrelated mythologies, or cross-epic figures (e.g., Mahabharata characters in a Ramayana system).

**Audit Result:** The system has **NO functional gatekeeper**. It attempts to process every entity as if it were part of the Ramayana canon.

## Unknown Entity Rejection Score
*   **Target:** 95%
*   **Actual:** **0%**

## Adversarial Test Results

| Query | Status | Actual Response Snippet | Reason for Failure |
| :--- | :--- | :--- | :--- |
| **Who is Krishna?** | **FAIL** | "...He is a great archer, one who has conquered his senses..." | Mapping to Rama/General verses. |
| **Who is Arjuna?** | **FAIL** | "O Arjuna tree, tell me if you know a timid lady..." | Confusing the character with the Arjuna tree. |
| **Who is Bhishma?** | **FAIL** | "...The noble Bharata, got his army encamped..." | Semantic overlap with royal lineage. |
| **Who is Draupadi?** | **FAIL** | "...he is the offspring of the Sungod. He has developed enmity..." | Random retrieval of Vali/Sugriva context. |
| **Who is Batman?** | **FAIL** | "...followed by bears, deer, tigers, lions..." | Verses about forest animals being retrieved. |
| **Who is Harry Potter?** | **FAIL** | "...understand the roles of Sugriva, Ravana..." | General RAG noise. |
| **Who is Goku?** | **FAIL** | "...understand the roles of Sita, Rama..." | General RAG noise. |
| **Who is Iron Man?** | **FAIL** | "...Your focus rests upon Rama..." | Mapping to primary protagonist. |

## Structural Vulnerability
The `EntityExtractor.resolve_entity` function correctly identifies if a name is NOT in the canonical list, but it returns the original name regardless:

```python
# From backend/app/ingestion/entity_extractor.py
def resolve_entity(self, name: str) -> str:
    # ... logic ...
    return name # Returns the unknown name, allowing the pipeline to proceed
```

The `BrainAgent` then takes this unknown name and performs a semantic search. Since Qdrant always returns results, the Sage attempts to synthesize an answer.

## Recommended Fix
1.  **Strict Mode:** If `intent == "factual"` and `EntityExtractor.resolve_entity` does not find a canonical match, the system should immediately return a "Sacred Silence" response.
2.  **Score Gating:** Block any response where the `best_score` is below `0.40`.
3.  **Negative Constraints:** Explicitly define a list of "Cross-Epic" names (Krishna, Arjuna, etc.) to trigger a specialized rejection: *"The Sage speaks only of the journey of Rama. The other avatars belong to a different time."*
