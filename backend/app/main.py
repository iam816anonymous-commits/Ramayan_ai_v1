from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from backend.app.agents.orchestrator import Orchestrator
from backend.app.agents.brain import BrainAgent
from backend.app.agents.sage import SageAgent
from backend.app.ingestion.pipeline import IngestionPipeline
import uvicorn
import time
import json
import os

app = FastAPI(title="Ramayana AI - Sanctum V1 API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global agents
orchestrator = Orchestrator()
brain = None # Will be initialized in startup
sage = SageAgent()

# Observability log file
OBSERVABILITY_LOG = "backend/observability.jsonl"

def log_query(data: Dict[str, Any]):
    with open(OBSERVABILITY_LOG, "a") as f:
        f.write(json.dumps(data) + "\n")

@app.on_event("startup")
async def startup_event():
    global brain
    pipeline = IngestionPipeline()
    pipeline.run_ingestion()
    brain = BrainAgent(client=pipeline.client)

class QueryRequest(BaseModel):
    query: str

class Revelation(BaseModel):
    reflection: str
    meaning: str
    context: str
    takeaway: str

class Meta(BaseModel):
    chunks_used: int
    kanda: Optional[str]
    entities: Dict[str, List[str]]
    verses: List[str]
    sources: List[str]

class QueryResponse(BaseModel):
    answer: str
    agent: str
    intent: str
    meta: Meta
    revelation: Revelation
    source_verse: Optional[str]

@app.post("/api/sanctum", response_model=QueryResponse)
async def sanctum_query(request: QueryRequest):
    start_time = time.time()
    try:
        intent = orchestrator.route_query(request.query)
        context = brain.retrieve_context(request.query)
        brain_response = brain.synthesize_response(request.query, context, intent)
        full_response = sage.get_full_response(request.query, brain_response, intent)

        latency = time.time() - start_time

        # Observability
        log_query({
            "timestamp": time.time(),
            "query": request.query,
            "intent": intent,
            "agent": full_response["agent"],
            "latency": latency,
            "entities": full_response["meta"]["entities"],
            "sources": full_response["meta"]["sources"]
        })

        return full_response
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
