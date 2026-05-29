# 34 Retrieval Quality Report: Vector Precision

## Retrieval Architecture
Sanctum V1 uses hybrid retrieval:
1.  Exact Metadata Match (via `EntityExtractor`)
2.  Dense Vector Search (via `sentence-transformers`)

## Performance Metrics (180 Queries)
*   **Entity Match Accuracy:** **30%** (Low score due to many queries lacking tagged metadata)
*   **Top-1 Relevance:** 82%
*   **Top-5 Relevance:** 91%
*   **Kanda Match Accuracy:** 78% (Successful in mapping events to their respective Books)

## Data Coverage and Retrieval Gaps

### Successes
*   **Locations:** "What is Ayodhya?" consistently retrieves the highest quality shlokas from the Bala Kanda.
*   **Core Events:** "How was Sita abducted?" retrieves specific Aranya Kanda verses correctly.

### Failures
*   **The "Obscure" Gap:** Queries for characters like "Sampati" or "Kabandha" often return high semantic scores but the retrieved metadata `character` field is empty. This is because the `IngestionPipeline` relies on a regex-based extractor that is not yet comprehensive.
*   **Entity Confusion:** Queries for "Bali" retrieve "Vali" context (Correct via Alias), but also the demon "Bali" mentioned in the Vamana story. The system lacks the ability to disambiguate two different characters sharing an alias.
*   **Scriptural Contamination:** "Who is Arjuna?" retrieves verses about the *Arjuna tree* (botanical) rather than the Mahabharata character, which is technically "Ramayana grounded" but contextually wrong for a user.

## Detailed Failure Patterns

| Pattern | Example | Cause |
| :--- | :--- | :--- |
| **Identity Mixup** | Who is Indrajit? | High semantic score, but retrieves verses where he is a secondary subject. |
| **Zero Tagging** | Who is Kabandha? | Payload has no entities tagged, even if the text mentions him. |
| **Keyword Overlap** | Tell me about Batman | Retrieves verses about 'lions and tigers' because of the word 'man'. |

## Retrieval Breakdown by Source
1.  **Valmiki_Ramayan_Shlokas.json:** Highest precision. Primary source for 90% of passed tests.
2.  **Kanda JSON files:** Primary source for "What happened" summary queries.
3.  **ramayan.txt:** Provides high semantic recall but lower structural precision (often missing verse numbers).

## Recommendations
*   **Entity-First indexing:** Perform a secondary NER pass during ingestion to ensure *every* mention of a character is tagged in the metadata.
*   **Score Penalty:** Apply a score penalty to "Non-Canonical" entities that aren't in the `entities.json` registry.
*   **Source Weighting:** Prioritize `Valmiki_Ramayan_Shlokas.json` over `ramayan.txt` for factual queries.
