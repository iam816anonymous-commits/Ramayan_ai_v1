# Ramayana AI — Sanctum V1 (Stabilized)

Welcome to the Sanctum. This document provides instructions on how to set up, run, and ingest your own data into the platform.

## 1. Local Setup & VS Code

### Prerequisites
- Python 3.10+
- Node.js 20+

### Step 1: Install Dependencies
Open your terminal and run:

```bash
# Backend
pip install -r backend/requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

### Step 2: Start the Backend
Open a new terminal in VS Code:
```bash
PYTHONPATH=. python3 -m uvicorn backend.app.main:app --port 8000
```
*The backend will automatically initialize the knowledge base on first run.*

### Step 3: Start the Frontend
Open another terminal in VS Code:
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:3000` to enter the Sanctum.

---

## 2. Learning from Your Data

The Sanctum "learns" from files placed in the `backend/data/` directory.

### Supported Formats
- **JSON:** Shloka datasets with `shloka_text`, `translation`, and `explanation`.
- **CSV:** Tabular scripture data.
- **TXT:** Raw text files (e.g., translations like Griffith's).

### How to add new data:
1. Place your files in `backend/data/`.
2. The ingestion pipeline (`backend/ingest/pipeline.py`) is configured to scan this folder.
3. To trigger a full re-index, delete the `backend/data/qdrant_storage/` folder and restart the backend.
4. The system will automatically:
   - Extract entities (Characters, Locations).
   - Generate vector embeddings for semantic search.
   - Ground the Sage's revelations in your specific source text.

---

## 3. Stabilization Notes (V1.1 Hotfix)
- **Timeline:** Now uses static data from `backend/knowledge/kanda_details.json` to ensure 100% uptime regardless of backend state.
- **Hydration:** Fixed issues with random particles causing UI flickering/errors during SSR handoff.
- **Performance:** Asynchronous RAG pipeline ensures the UI remains responsive during deep scriptural retrievals.
