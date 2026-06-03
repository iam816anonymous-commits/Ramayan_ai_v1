import json
import os
import sys
from qdrant_client import QdrantClient

# Set up paths
sys.path.append(os.getcwd())

def validate_coverage():
    print("==================================================")
    print("PHASE 5 — ENTITY COVERAGE")
    print("==================================================")

    # 1. Load Knowledge Base
    entities_path = "backend/knowledge/entities.json"
    with open(entities_path, 'r') as f:
        knowledge = json.load(f)

    total_chars_kb = len(knowledge["characters"])
    total_locs_kb = len(knowledge["locations"])
    total_events_kb = len(knowledge["events"])

    print(f"Knowledge Base Statistics:")
    print(f"  Total Characters: {total_chars_kb}")
    print(f"  Total Locations: {total_locs_kb}")
    print(f"  Total Events: {total_events_kb}")

    # 2. Analyze Qdrant Data
    client = QdrantClient(path="backend/data/qdrant_storage")
    collection_name = "ramayana_v1"

    all_points = client.scroll(
        collection_name=collection_name,
        limit=10000,
        with_payload=True,
        with_vectors=False
    )[0]

    tagged_count = 0
    untagged_count = 0

    # Track missing entities (entities appearing in text but not in KB)
    # This is a bit complex without an LLM, but we can check the 'entities' payload
    # which is populated during ingestion by MetadataBuilder/KnowledgeBuilder.

    for point in all_points:
        payload = point.payload
        entities = payload.get("entities", {})

        has_entities = (
            len(entities.get("characters", [])) > 0 or
            len(entities.get("locations", [])) > 0 or
            len(entities.get("events", [])) > 0
        )

        if has_entities:
            tagged_count += 1
        else:
            untagged_count += 1

    total_docs = tagged_count + untagged_count
    coverage = (tagged_count / total_docs) * 100 if total_docs > 0 else 0

    print(f"\nDocument Coverage Statistics:")
    print(f"  Total Documents Scanned: {total_docs}")
    print(f"  Tagged Documents: {tagged_count}")
    print(f"  Untagged Documents: {untagged_count}")
    print(f"  Coverage Percentage: {coverage:.2f}%")

    # Identify top "missing" entities (entities not in KB but found in documents)
    # Actually, KnowledgeBuilder only tags what's in KB or what extractor finds.
    # We'll list characters in the KB for reference.
    print(f"\nTop 20 Characters in Knowledge Base:")
    for char in [c["name"] for c in knowledge["characters"][:20]]:
        print(f"  - {char}")

if __name__ == "__main__":
    validate_coverage()
