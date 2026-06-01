# 12 Developer Onboarding: Contributing to the Sanctum

## Welcome, Seeker
This guide will help you set up and extend the Ramayana AI intelligence platform.

## Folder Structure
```text
.
├── backend/
│   ├── app/
│   │   ├── agents/      # Specialised AI logic
│   │   ├── ingestion/   # Data processing pipeline
│   │   └── main.py      # FastAPI entry point
│   ├── data/            # RAW data (JSON/CSV/TXT)
│   ├── knowledge/       # Registry of entities and lessons
│   └── logs/            # Observability output
└── frontend/
    └── src/app/
        ├── components/  # Sanctum UI components
        └── page.tsx     # Layout and main view
```

## How to Run Locally
1.  Ensure you have **Python 3.12+** and **Node 22+**.
2.  Install backend deps: `pip install -r backend/requirements.txt`.
3.  Install frontend deps: `cd frontend && npm install`.
4.  Launch Backend: `python3 -m backend.app.main` (Wait for "Ingestion complete").
5.  Launch Frontend: `cd frontend && npm run dev`.

## How to Ingest New Data
1.  Place your raw file in `backend/data/`.
2.  If it's a new format, create a new loader in `backend/ingest/` inheriting from `BaseLoader`.
3.  Register the loader in `pipeline.py`.
4.  Delete `backend/data/qdrant_storage/` to force a clean re-ingest.

## How to Add New Agents
1.  Create a new file in `backend/app/agents/` (e.g., `theological_agent.py`).
2.  Implement a `synthesize(query, context)` method.
3.  Update `Orchestrator.route_query` to include keywords that trigger your new agent.
4.  Update `BrainAgent.synthesize_response` to route to your new class.

## How to Add New Data Sources
If you find a new translation or analytical dataset:
1.  Normalize it to the schema: `{text, kanda, chapter, verse}`.
2.  Add it to the `loaders` dictionary in `IngestionPipeline.run_ingestion()`.

## Debugging Retrieval Issues
*   **Query doesn't find the right verse:** Check if the entity is in `aliases.json`. If "Vasista" isn't mapping to "Vasistha", semantic search might score lower than an exact match.
*   **Response is generic:** The `BrainAgent` might be failing the `grounded` check. Check the `backend.log` for ingestion point counts.
*   **Slow UI:** Check the `REVELATION_TIMINGS` in `SanctumChat.tsx`.
