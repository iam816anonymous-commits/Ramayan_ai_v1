from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from backend.app.agents.orchestrator import Orchestrator
from backend.app.agents.brain import BrainAgent
from backend.app.agents.sage import SageAgent
from backend.app.ingestion.pipeline import IngestionPipeline
import uvicorn

app = FastAPI(title="Ramayana AI - Sanctum API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize global agents and data
orchestrator = Orchestrator()
brain = BrainAgent()
sage = SageAgent()

# In-memory startup data population for V1 demo
@app.on_event("startup")
async def startup_event():
    pipeline = IngestionPipeline()
    pipeline.run_ingestion()
    brain.client = pipeline.client

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    formatted_response: str
    intent: str
    source_verse: Optional[str]

@app.post("/api/sanctum", response_model=QueryResponse)
async def sanctum_query(request: QueryRequest):
    try:
        intent = orchestrator.route_query(request.query)
        context = brain.retrieve_context(request.query)
        raw_response = brain.synthesize_response(request.query, context, intent)
        formatted_response = sage.format_response(raw_response)

        return {
            "formatted_response": formatted_response,
            "intent": intent,
            "source_verse": raw_response.get("source_verse")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
