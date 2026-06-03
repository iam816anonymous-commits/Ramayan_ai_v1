import os
import sys
import json
import asyncio
import anyio

# Setup paths
sys.path.append(os.getcwd())

from backend.app.agents.orchestrator import Orchestrator
from backend.app.agents.brain import BrainAgent
from backend.app.agents.sage import SageAgent
from qdrant_client import QdrantClient

async def run_wisdom_suite():
    storage_path = os.path.join("backend", "data", "qdrant_storage")
    client = QdrantClient(path=storage_path)
    orchestrator = Orchestrator()
    brain = BrainAgent(client=client)
    sage = SageAgent()

    test_cases = [
        # Character Tests
        "Who is Sampati?", "Who is Angada?", "Who is Ruma?", "Who is Kaikeyi?",
        "Who is Vasistha?", "Who is Jatayu?", "Who is Shatrughna?", "Who is Kabandha?",
        # Personal Tests
        "I am lonely", "I feel betrayed", "I am afraid", "I feel angry", "I have failed",
        # Moral Tests
        "What is Dharma?", "What is duty?", "What is sacrifice?", "What is devotion?", "What is leadership?",
        # Alias Tests
        "Who is Ram?", "Who is Bali?", "Who is Vasista?", "Who is Angadha?",
        # Relationship Tests
        "Rama and Hanuman", "Rama and Ravana", "Jatayu and Sampati", "Angada and Vali", "Vali and Sugriva"
    ]

    for query in test_cases:
        print(f"QUERY: {query}")
        intent = orchestrator.route_query(query)
        entities = brain.entity_extractor.extract_entities(query)
        context = await brain.retrieve_context(query, intent=intent, entities=entities)
        brain_res = await brain.synthesize_response(query, context, intent, entities=entities)
        full_res = sage.get_full_response(query, brain_res, intent)

        print(f"INTENT: {full_res['intent']}")
        print(f"REFLECTION: {full_res['revelation']['reflection']}")
        print(f"MEANING: {full_res['revelation']['meaning']}")
        print(f"CONTEXT: {full_res['revelation']['context']}")
        print(f"TAKEAWAY: {full_res['revelation']['takeaway']}")
        print("-" * 40)

if __name__ == "__main__":
    asyncio.run(run_wisdom_suite())
