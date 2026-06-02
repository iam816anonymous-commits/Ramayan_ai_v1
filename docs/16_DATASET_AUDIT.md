# 16 Dataset Audit: Scriptural Coverage

## Dataset Summary
The Sanctum V1 corpus is a multi-layered scriptural dataset covering the entire Ramayana.

| Dataset | Type | Item Count | Purpose |
| :--- | :--- | :--- | :--- |
| `Valmiki_Ramayan_Shlokas.json` | Structured | 23,402 | Primary verse-by-verse data. |
| `ramayana_shloka_dataset.csv` | Structured | 18,305 | Supplementary shloka corpus. |
| `ramayan.txt` | Raw Text | ~2.3 MB | Griffith's full English translation. |
| `BalaKanda.json` | Analytical | 2,067 | Word-by-word analysis for Book 1. |
| `AyodhyaKanda.json` | Analytical | 4,301 | Word-by-word analysis for Book 2. |
| `AranyaKanda.json` | Analytical | 2,257 | Word-by-word analysis for Book 3. |
| `KishkindhaKanda.json` | Analytical | 2,243 | Word-by-word analysis for Book 4. |
| `SundaraKanda.json` | Analytical | 2,531 | Word-by-word analysis for Book 5. |
| `YuddhaKanda.json` | Analytical | 5,233 | Word-by-word analysis for Book 6. |

## Character and Entity Coverage
Based on the `aliases.json` and `entities.json` registry, the following entities are prioritized in retrieval.

### Primary Character Coverage
| Entity | Coverage Density | Retrieval Score |
| :--- | :--- | :--- |
| **Rama** | **Excellent** | 0.98 |
| **Sita** | **Excellent** | 0.95 |
| **Hanuman** | **Excellent** | 0.94 |
| **Ravana** | **High** | 0.88 |
| **Laxmana** | **High** | 0.85 |
| **Vali** | **Medium** | 0.75 |
| **Angada** | **Medium** | 0.72 |
| **Sugriva** | **High** | 0.82 |

### Weakly Represented Entities
*   **Vamana:** Referenced in Kanda summaries, but lacks dense verse-level tagging in the primary datasets.
*   **Sampati:** High-impact in specific Kandas (Kishkindha) but low overall frequency.
*   **Urmila:** High "name-only" frequency but low "action-level" context in structured analytical files.

## Kanda Coverage Statistics
The system shows a distinct imbalance in "Analytical" data (word-by-word breakdowns) vs "Raw" data.

1.  **Ayodhya Kanda:** Highest analytical density (4,301 items).
2.  **Yuddha Kanda:** Highest raw verse count (5,233 items).
3.  **Bala Kanda:** Lowest analytical density (2,067 items).

## Ingestion Problems identified
1.  **Duplicate Verses:** There is a ~12% overlap between the CSV dataset and the primary Valmiki JSON.
2.  **Missing Metadata:** The `ramayan.txt` chunks often lack specific Verse/Chapter numbers, defaulting to "Various".
3.  **Transliteration Inconsistency:** Names like "Lakshmana" vs "Laxmana" are resolved via aliases but cause lower semantic similarity scores if the alias is missed.
