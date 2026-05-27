from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from backend.app.agents.orchestrator import Orchestrator
from backend.app.agents.brain import BrainAgent
from backend.app.agents.sage import SageAgent
from backend.app.ingestion.pipeline import IngestionPipeline
from backend.app.ingestion.entity_extractor import EntityExtractor
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

# Global agents and tools
orchestrator = Orchestrator()
brain = None
sage = SageAgent()
entity_extractor = EntityExtractor()

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

@app.get("/api/knowledge/{entity_name}")
async def get_entity_knowledge(entity_name: str):
    try:
        canonical = entity_extractor.resolve_entity(entity_name)
        relations = entity_extractor.get_relations(canonical)

        # Find description if available
        description = "A sacred entity in the Ramayana."
        for cat in entity_extractor.entities:
            for ent in entity_extractor.entities[cat]:
                if ent["name"] == canonical:
                    description = ent.get("description", description)
                    break

        return {
            "entity": canonical,
            "description": description,
            "relations": relations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
