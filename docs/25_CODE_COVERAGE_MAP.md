# 25 Code Coverage Map: Architecture

## Backend Coverage

| Component | File | Purpose | Maintainability |
| :--- | :--- | :--- | :--- |
| **API** | `main.py` | Routing and startup | High |
| **Agent** | `brain.py` | Retrieval & Synthesis | Medium |
| **Agent** | `orchestrator.py` | Intent detection | High |
| **Agent** | `moral_agent.py` | Ethical grounding | High |
| **Agent** | `personal_agent.py` | Emotional resonance | High |
| **Agent** | `sage.py` | Response formatting | High |
| **Ingest** | `pipeline.py` | Unified indexing | Medium |
| **Ingest** | `entity_extractor.py` | BFS & Aliases | Medium |
| **Ingest** | `txt_loader.py` | Raw text parsing | Low |

## Frontend Coverage

| Component | File | Purpose | Maintainability |
| :--- | :--- | :--- | :--- |
| **UI** | `SanctumChat.tsx` | Revelation Engine | Medium |
| **UI** | `Timeline.tsx` | Journey Explorer | High |
| **State** | `layout.tsx` | Fonts & Global styles | High |

## Dependency Map

### Ingestion Dependency Chain
`pipeline.py` → `knowledge_builder.py` → `metadata_builder.py` → `entity_extractor.py` → `aliases.json`

### Retrieval Dependency Chain
`main.py` → `orchestrator.py` → `brain.py` → `Qdrant` + `entity_extractor.py`

## Dead Code and Risk Analysis
1.  **`knowledge_builder.py`:** Contains a partially skeletal `build_relations` function that is currently superseded by the static `relations.json`. Risk: **Low**.
2.  **`TXTLoader` Indentation:** Previously identified as a risk, now verified as fixed.
3.  **`test_entity_layer.py` (compiled):** Remnants of compiled tests found in `__pycache__`. Risk: **None**.

## Maintainability Ratings
*   **High:** Modular, clear purpose, low side effects.
*   **Medium:** Complex logic, some hardcoded strings, requires deep scriptural knowledge.
*   **Low:** Needs refactoring, brittle parsing, or lacks comprehensive error handling.
