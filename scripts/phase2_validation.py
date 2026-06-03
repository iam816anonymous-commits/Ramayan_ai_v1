import asyncio
import sys
import os
import json
from qdrant_client import QdrantClient

# Set up paths
sys.path.append(os.getcwd())

from backend.app.agents.brain import BrainAgent
from backend.ingest.pipeline import IngestionPipeline

async def validate_retrieval():
    print("==================================================")
    print("PHASE 2 — RETRIEVAL VALIDATION")
    print("==================================================")

    # Initialize Brain
    storage_path = "backend/data/qdrant_storage"
    client = QdrantClient(path=storage_path)
    brain = BrainAgent(client=client)

    queries = [
        "Who is Rama?",
        "Who is Sita?",
        "Who is Hanuman?",
        "Who is Ravana?",
        "Who is Angada?",
        "Who is Sampati?",
        "Who is Vasistha?",
        "Who is Ruma?",
        "Who is Jatayu?"
    ]

    for query in queries:
        print(f"\nQUERY: {query}")
        print("-" * 30)

        # 1. Retrieve Context
        context = await brain.retrieve_context(query, intent="factual")

        if not context:
            print("No context retrieved.")
            continue

        # 2. Extract entities for synthesis
        from backend.ingest.entity_extractor import EntityExtractor
        extractor = EntityExtractor()
        entities = extractor.extract_entities(query)

        # 3. Synthesize
        response = await brain.synthesize_response(query, context, intent="factual", entities=entities)

        # 4. Display results
        for i, chunk in enumerate(context):
            print(f"CHUNK {i+1}:")
            print(f"  Text: {chunk.get('text', '')[:200]}...")
            print(f"  Source: {chunk.get('source', 'Unknown')}")
            print(f"  Similarity Score (Semantic): {chunk.get('score', 'N/A')}")
            print(f"  Rerank Score: {chunk.get('rerank_score', 'N/A')}")

        print(f"CONFIDENCE SCORE: {response['meta'].get('confidence', 'N/A')}")
        print(f"FINAL RESPONSE: {response['meaning']}")
        print(f"REVELATION REFLECTION: {response['reflection']}")
        print("=" * 50)

if __name__ == "__main__":
    asyncio.run(validate_retrieval())
