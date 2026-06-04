from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Annotated
from backend.app.agents.orchestrator import Orchestrator
from backend.app.agents.brain import BrainAgent
from backend.app.agents.sage import SageAgent
from backend.app.cache import cache_instance
from backend.ingest.pipeline import IngestionPipeline
from backend.ingest.entity_extractor import EntityExtractor
from dotenv import load_dotenv
import uvicorn
import time
import json
import os
import secrets

# Load environment variables
load_dotenv()

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
LOG_DIR = "backend/logs"
OBSERVABILITY_LOG = os.path.join(LOG_DIR, "observability.jsonl")

def log_query(data: Dict[str, Any]):
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(OBSERVABILITY_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(data) + "\n")

@app.on_event("startup")
async def startup_event():
    global brain
    pipeline = IngestionPipeline()
    pipeline.run_ingestion()
    # Share the same client instance to avoid lock issues
    brain = BrainAgent(client=pipeline.client)

class QueryRequest(BaseModel):
    query: str = Field(..., max_length=500)

class ReindexRequest(BaseModel):
    force: bool = False

class Revelation(BaseModel):
    reflection: str
    meaning: str
    context: str
    takeaway: str

class Meta(BaseModel):
    chunks_used: int
    kanda: Optional[str] = "Universal"
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

@app.post("/api/admin/reindex")
async def admin_reindex(request: ReindexRequest, x_admin_token: Annotated[Optional[str], Header()] = None):
    # Security: Verify Admin Token with constant-time comparison
    expected_token = os.getenv("ADMIN_TOKEN")
    if not expected_token or not x_admin_token or not secrets.compare_digest(x_admin_token, expected_token):
        raise HTTPException(status_code=401, detail="Unauthorized access to administrative endpoint.")

    global brain
    if brain is None:
         raise HTTPException(status_code=503, detail="Brain not initialized.")
    try:
        # Use brain's client to avoid lock issues
        pipeline = IngestionPipeline(client=brain.client)
        pipeline.run_ingestion(force=request.force)
        # BrainAgent already uses the same client
        return {"status": "success", "message": "Re-indexing complete."}
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error during re-indexing.")

@app.post("/api/sanctum", response_model=QueryResponse)
async def sanctum_query(request: QueryRequest):
    if brain is None:
        raise HTTPException(status_code=503, detail="Knowledge Brain is still initializing. Please wait.")

    # Check cache
    cached_response = cache_instance.get(request.query)
    if cached_response:
        return cached_response

    start_time = time.time()
    try:
        intent = orchestrator.route_query(request.query)
        entities = entity_extractor.extract_entities(request.query)
        context = await brain.retrieve_context(request.query, intent=intent, entities=entities)
        brain_response = await brain.synthesize_response(request.query, context, intent, entities=entities)
        full_response = sage.get_full_response(request.query, brain_response, intent)

        # Cache the response
        cache_instance.set(request.query, full_response)

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
        # Internal logging remains detailed
        print(f"Error: {e}")
        # Thematic error response to maintain immersion
        return {
            "answer": "The Sage has entered a deep state of samadhi and cannot be reached at this moment.",
            "agent": "Sanctum Guard",
            "intent": "factual",
            "meta": {
                "chunks_used": 0,
                "entities": {"characters": [], "locations": [], "events": []},
                "verses": [],
                "sources": [],
                "grounded": False
            },
            "revelation": {
                "reflection": "The path is momentarily clouded by the mists of the infinite.",
                "meaning": "A spiritual disturbance has interrupted our communion.",
                "context": "Even the greatest seekers encounter moments of silence.",
                "takeaway": "Patience is the first step toward true wisdom. Try again when the winds of fate shift."
            },
            "source_verse": "N/A"
        }

@app.get("/api/timeline")
async def get_timeline():
    path = "backend/knowledge/kanda_details.json"
    if os.path.exists(path):
        with open(path, 'r', encoding="utf-8") as f:
            return json.load(f)
    return []

@app.get("/api/heroes")
async def get_heroes():
    try:
        entities_path = "backend/knowledge/entities.json"
        relations_path = "backend/knowledge/relations.json"

        with open(entities_path, 'r', encoding="utf-8") as f:
            entities_data = json.load(f)
        with open(relations_path, 'r', encoding="utf-8") as f:
            relations_data = json.load(f)

        heroes = []
        for char in entities_data.get("characters", []):
            # Extract relationships for this character
            char_relations = set()
            for rel in relations_data:
                if rel["source"] == char["name"]:
                    # Map types to natural labels
                    type_labels = {
                        "father_of": f"Father of {rel['target']}",
                        "mother_of": f"Mother of {rel['target']}",
                        "brother_of": f"Brother of {rel['target']}",
                        "spouse_of": f"Spouse of {rel['target']}",
                        "enemy_of": f"Enemy of {rel['target']}",
                        "devotee_of": f"Devotee of {rel['target']}",
                        "ally_of": f"Ally of {rel['target']}"
                    }
                    label = type_labels.get(rel["type"], f"{rel['type'].replace('_', ' ').capitalize()} {rel['target']}")
                    char_relations.add(label)
                elif rel["target"] == char["name"]:
                    # Inverse relationship display logic
                    if rel["type"] == "father_of":
                        char_relations.add(f"Child of {rel['source']}")
                    elif rel["type"] == "mother_of":
                        char_relations.add(f"Child of {rel['source']}")
                    elif rel["type"] == "spouse_of":
                        char_relations.add(f"Spouse of {rel['source']}")
                    elif rel["type"] == "devotee_of":
                        char_relations.add(f"Lord of {rel['source']}")
                    elif rel["type"] == "brother_of":
                        char_relations.add(f"Brother of {rel['source']}")
                    elif rel["type"] == "enemy_of":
                        char_relations.add(f"Enemy of {rel['source']}")

            heroes.append({
                "name": char["name"],
                "sanskrit": char.get("sanskrit", "श्री"),
                "role": char.get("significance", "A pivotal figure of the Ramayana."),
                "virtues": char.get("traits", ["Dharma"]),
                "significance": char.get("significance"),
                "relationships": ", ".join(sorted(list(char_relations))) if char_relations else "Ties of destiny are being revealed.",
                "description": char.get("description")
            })
        return heroes
    except Exception as e:
        print(f"Hero expansion error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during Hero resolution.")

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
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error while retrieving entity knowledge.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
