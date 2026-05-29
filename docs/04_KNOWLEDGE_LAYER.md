# 04 Knowledge Layer: Mythology Intelligence

## Data Sources
The Knowledge Layer integrates diverse scriptural and analytical datasets into a single, unified vector space.

| Source | File | Content |
| :--- | :--- | :--- |
| **Valmiki Shlokas** | `Valmiki_Ramayan_Shlokas.json` | 23k+ primary verses with word meanings. |
| **CSV Corpus** | `ramayana_shloka_dataset.csv` | 61k+ supplementary verses. |
| **Griffith Text** | `ramayan.txt` | Raw text translation (2.3MB) segmented by Canto. |
| **Kanda Metadata** | `kanda_details.json` | Summaries, themes, and key events for each Book. |
| **Dharma Lessons** | `dharma_lessons.json` | Grounded moral mappings for the `MoralAgent`. |

## Ingestion Pipeline
The pipeline (`backend/app/ingestion/pipeline.py`) processes files through several stages:

### 1. Loading and Normalization
Each file format has a dedicated loader (e.g., `ShlokaLoader`, `TXTLoader`). All data is normalized into a unified object:
```json
{
  "text": "The verse or passage text",
  "character": "Primary character involved",
  "kanda": "The Book name (e.g., Bala Kanda)",
  "chapter": "Chapter/Canto title",
  "verse": "Verse number or 'Various'",
  "source": "Filename or translation title"
}
```

### 2. Entity Extraction and Enrichment
The `KnowledgeBuilder` uses the `EntityExtractor` to pre-scan every document chunk for known characters, locations, and events. This metadata is stored in the `entities` field of the vector payload to allow for:
*   Fast metadata filtering.
*   "Thread of Fate" pathfinding.

### 3. Chunking
*   **Structured Data:** One point per JSON object or CSV row.
*   **Raw Text:** `TXTLoader` chunks by double newline (`\n\n`) within Cantos, ensuring chunks are > 100 characters.

### 4. Vector Storage
*   **Engine:** Qdrant (Local Persistent Mode).
*   **Location:** `backend/data/qdrant_storage`.
*   **Embeddings:** `all-MiniLM-L6-v2` (384-dimensional).

## Knowledge Schema Definitions

### Entity Registry (`entities.json`)
Defines characters, locations, and events with canonical names and descriptions.

### Alias System (`aliases.json`)
Maps variations to canonical names:
```json
{
  "bali": ["bali"],
  "vali": ["bali"],
  "vasishtha": ["vasistha"],
  "vasista": ["vasistha"]
}
```

### Relationship Graph (`relations.json`)
Defines directional links used for pathfinding:
```json
[
  { "source": "Hanuman", "type": "SERVES", "target": "Rama" },
  { "source": "Angada", "type": "SON_OF", "target": "Vali" }
]
```
