import asyncio
import sys
import os
import json
from qdrant_client import QdrantClient

# Set up paths
sys.path.append(os.getcwd())

from backend.app.agents.brain import BrainAgent

async def validate_hallucination():
    print("==================================================")
    print("PHASE 3 — HALLUCINATION VALIDATION")
    print("==================================================")

    # Initialize Brain
    storage_path = "backend/data/qdrant_storage"
    client = QdrantClient(path=storage_path)
    brain = BrainAgent(client=client)

    queries = [
        "Who is Batman?",
        "Who is Harry Potter?",
        "Who is Iron Man?",
        "Who is Krishna?",
        "Who is Arjuna?",
        "Who is Bhishma?"
    ]

    for query in queries:
        print(f"\nQUERY: {query}")
        print("-" * 30)

        # 1. Extract entities for synthesis
        from backend.ingest.entity_extractor import EntityExtractor
        extractor = EntityExtractor()
        entities = extractor.extract_entities(query)

        # 2. Retrieve Context
        context = await brain.retrieve_context(query, intent="factual", entities=entities)

        # 3. Synthesize
        response = await brain.synthesize_response(query, context, intent="factual", entities=entities)

        print(f"GROUNDED: {response['meta'].get('grounded', 'N/A')}")
        print(f"CONFIDENCE: {response['meta'].get('confidence', 'N/A')}")
        print(f"REFLECTION: {response['reflection']}")
        print(f"MEANING: {response['meaning']}")
        print("=" * 50)

if __name__ == "__main__":
    asyncio.run(validate_hallucination())
