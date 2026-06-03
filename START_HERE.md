# Sanctum | Premium Divine Ramayana Experience

Welcome to the Sanctum. This is a sacred interactive experience designed for contemplation on the Ramayana.

## 1. Local Setup & VS Code (Launch Guide)

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
pnpm install
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
pnpm dev
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

## 3. Premium Experience Architecture
- **Unified Sage Presence:** A singular focal orb combining sacred geometry and breathing aura.
- **Sequential Revelation:** Wisdom is revealed in four stages (Reflection, Meaning, Context, Takeaway) with intentional timing.
- **Chronicles (Timeline):** A museum-style vertical journey through the Seven Kandas.
- **Luxury Aesthetic:** Deep Obsidian (#050505) and Metallic Gold (#D4AF37) palette with Cinzel & Lora typography.

## 4. Stabilization & Reliability
- **Zero-Fetch Timeline:** Uses static scriptural metadata to prevent runtime network errors.
- **Hydration Secure:** All dynamic elements (particles, random paths) are gated by client-side mount checks.
- **Asynchronous RAG:** Backend model inference is offloaded from the event loop for smooth UI performance.
