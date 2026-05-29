import os
import sys
import json
import time
from typing import List, Dict

# Setup paths for local imports
sys.path.append(os.getcwd())

from backend.app.agents.orchestrator import Orchestrator
from backend.app.agents.brain import BrainAgent
from qdrant_client import QdrantClient

class RetrievalBenchmark:
    def __init__(self):
        storage_path = os.path.join("backend", "data", "qdrant_storage")
        self.client = QdrantClient(path=storage_path)
        self.brain = BrainAgent(client=self.client)

    def run_benchmark(self, queries: List[Dict]):
        results = []
        for item in queries:
            query = item["query"]
            expected_kanda = item.get("kanda")
            expected_char = item.get("character")

            start_time = time.time()
            context = self.brain.retrieve_context(query, top_k=5)
            latency = time.time() - start_time

            top_1_kanda = context[0].get("kanda") if context else None
            top_1_char = context[0].get("character") if context else None

            kanda_hit = any(c.get("kanda") == expected_kanda for c in context) if expected_kanda else True
            char_hit = any(expected_char in c.get("character", "") for c in context) if expected_char else True

            results.append({
                "query": query,
                "latency": latency,
                "kanda_match": top_1_kanda == expected_kanda if expected_kanda else True,
                "char_match": (expected_char in top_1_char) if expected_char and top_1_char else True,
                "hit_rate_5": kanda_hit and char_hit
            })

        return results

if __name__ == "__main__":
    benchmark = RetrievalBenchmark()
    test_queries = [
        {"query": "Who is Rama?", "character": "Rama", "kanda": "Bala Kanda"},
        {"query": "What was Rama's exile?", "kanda": "Ayodhya Kanda"},
        {"query": "How was Sita abducted?", "character": "Sita", "kanda": "Aranya Kanda"},
        {"query": "Who is Hanuman?", "character": "Hanuman", "kanda": "Kishkindha Kanda"},
        {"query": "The leap to Lanka", "character": "Hanuman", "kanda": "Sundara Kanda"},
        {"query": "The battle against Ravana", "character": "Ravana", "kanda": "Yuddha Kanda"}
    ]

    report = benchmark.run_benchmark(test_queries)

    avg_latency = sum(r["latency"] for r in report) / len(report)
    accuracy_kanda = sum(1 for r in report if r["kanda_match"]) / len(report)
    hit_rate = sum(1 for r in report if r["hit_rate_5"]) / len(report)

    print(f"--- Retrieval Benchmark Results ---")
    print(f"Average Latency: {avg_latency:.4f}s")
    print(f"Top-1 Kanda Accuracy: {accuracy_kanda:.2%}")
    print(f"Top-5 Hit Rate: {hit_rate:.2%}")

    with open("retrieval_benchmark_v2.1.json", "w") as f:
        json.dump(report, f, indent=2)
