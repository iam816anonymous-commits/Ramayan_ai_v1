# 11 Deployment Guide: Sanctum Production

## Assumptions
This guide assumes deployment to a platform like **Railway**, **Fly.io**, or **Render**. It avoids cloud-specific managed services (like AWS SageMaker or DynamoDB) to maintain the local-first architecture.

## Required Environment Variables
| Variable | Purpose | Example |
| :--- | :--- | :--- |
| `PYTHONPATH` | Ensure module resolution | `.` |
| `CORS_ORIGINS` | Allow frontend to talk to API | `https://sanctum.app` |
| `PERSISTENT_STORAGE` | Path to Qdrant storage | `/data/qdrant_storage` |

## Dependencies
*   **Backend:** Python 3.12, `requirements.txt` (FastAPI, Uvicorn, Qdrant-Client, Sentence-Transformers, Pandas).
*   **Frontend:** Node.js 22, `package.json` (Next.js 15, Framer Motion, Tailwind).

## Local Setup
1.  **Clone Repository.**
2.  **Backend:**
    ```bash
    pip install -r backend/requirements.txt
    python3 -m backend.app.main
    ```
3.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Production Deployment (Containerized)

### Backend (Dockerfile Example)
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Pre-run ingestion or ensure volume persistence
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (Dockerfile Example)
```dockerfile
FROM node:22-slim
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend .
RUN npm run build
CMD ["npm", "start"]
```

## Storage Volumes
**Crucial:** For the "Whole-Brain" persistence to work on cloud platforms, you must mount a **persistent volume** at the directory defined in the `IngestionPipeline` (`backend/data/qdrant_storage`). Otherwise, the system will re-ingest the entire 80k-point corpus on every deploy.

## Build Process
1.  **Backend:** No build required (runtime interpreted).
2.  **Frontend:** `npm run build` is required for Next.js to optimize assets and pre-render components.

## Limitations on Managed Platforms
Some platforms (like Heroku or free-tier Render) may experience slow startups due to the initialization of the `sentence-transformers` model (~400MB). It is recommended to use a machine with at least **2GB RAM**.
