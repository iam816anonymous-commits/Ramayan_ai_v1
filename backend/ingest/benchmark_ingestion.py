import time
import sys
import os
from unittest.mock import MagicMock
from qdrant_client.models import PointStruct

# Add project root to path
sys.path.append(os.getcwd())

from backend.app.models import get_sentence_transformer
from backend.ingest.knowledge_builder import KnowledgeBuilder
from backend.ingest.metadata_builder import MetadataBuilder

def benchmark():
    model = get_sentence_transformer()
    knowledge_builder = KnowledgeBuilder()
    metadata_builder = MetadataBuilder()

    # Sample data
    data = [
        {"text": f"This is a sample shloka number {i} for benchmarking.", "kanda": "Bala", "chapter": 1, "verse": i}
        for i in range(128)
    ]

    print(f"Benchmarking with {len(data)} items...")

    # 1. Individual Processing (Simulated)
    start = time.perf_counter()
    processed_count = 0
    for item in data:
        enriched_item = knowledge_builder.enrich_item(item)
        unified_obj = metadata_builder.build(enriched_item)
        if unified_obj["text"].strip():
            vector = model.encode(unified_obj["text"]).tolist()
            processed_count += 1
    individual_time = time.perf_counter() - start
    print(f"Individual processing time: {individual_time:.4f}s")

    # 2. Batch Processing
    start = time.perf_counter()
    batch_size = 64
    processed_count_batch = 0
    for i in range(0, len(data), batch_size):
        batch_items = data[i:i + batch_size]
        batch_metadata = []
        for item in batch_items:
            enriched_item = knowledge_builder.enrich_item(item)
            unified_obj = metadata_builder.build(enriched_item)
            if unified_obj["text"].strip():
                batch_metadata.append(unified_obj)

        if batch_metadata:
            texts = [obj["text"] for obj in batch_metadata]
            vectors = model.encode(texts).tolist()
            processed_count_batch += len(batch_metadata)

    batch_time = time.perf_counter() - start
    print(f"Batch processing time (batch_size=64): {batch_time:.4f}s")

    speedup = individual_time / batch_time
    print(f"Speedup: {speedup:.2f}x")

    return speedup

if __name__ == "__main__":
    benchmark()
