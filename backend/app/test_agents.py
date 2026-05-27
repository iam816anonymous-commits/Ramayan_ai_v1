from backend.app.ingestion.pipeline import IngestionPipeline
from backend.app.agents.brain import BrainAgent
from backend.app.agents.orchestrator import Orchestrator
from backend.app.agents.sage import SageAgent
import json

def test_full_flow():
    # 1. Setup Data
    pipeline = IngestionPipeline()
    pipeline.run_ingestion()

    # 2. Setup Agents
    orchestrator = Orchestrator()
    brain = BrainAgent(client=pipeline.client)
    sage = SageAgent()

    query = "Why did Rama go to the forest?"
    print(f"\n--- User Query: {query} ---")

    # 3. Process
    intent = orchestrator.route_query(query)
    print(f"Detected Intent: {intent}")

    context = brain.retrieve_context(query)
    raw_response = brain.synthesize_response(query, context, intent)

    final_response = sage.get_full_response(query, raw_response, intent)
    print("\n--- Sage Response ---\n")
    print(json.dumps(final_response, indent=2))

if __name__ == "__main__":
    test_full_flow()
