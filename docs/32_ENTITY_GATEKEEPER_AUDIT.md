# 32 Entity Gatekeeper Audit: V2.1 Hardening

## Summary
The **Entity Validator** is now a mandatory gate in the retrieval pipeline. It identifies known canonical entities, resolves aliases, and heuristically detects potential unknown entities.

## Unknown Entity Rejection Score
*   **Target:** 95%
*   **Actual:** **100%** (for simulated queries)

## Verification Proof

| Query | Status | Proof |
| :--- | :--- | :--- |
| **Who is Draupadi?** | **REJECTED** | Correctly identified as non-existent in registry. |
| **Who is Batman?** | **REJECTED** | Correctly identified as non-existent in registry. |
| **Who is Elon Musk?** | **REJECTED** | Correctly identified as non-existent in registry. |
| **Who is Rama?** | **ACCEPTED** | Canonical match. |
| **Who is Ram?** | **ACCEPTED** | Resolved via Alias to Rama. |

## Implementation Details
*   **File:** `backend/app/ingestion/entity_validator.py`
*   **Method:** `validate_entity` + `extract_potential_entities`
*   **Pipeline:** Integrated into `BrainAgent.synthesize_response` as a pre-synthesis block for factual queries.
