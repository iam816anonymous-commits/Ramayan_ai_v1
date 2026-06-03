import time
import numpy as np
from typing import Dict, Any, Optional, List
from backend.app.models import get_sentence_transformer

class SemanticCache:
    def __init__(self, size: int = 100, threshold: float = 0.92):
        self.size = size
        self.threshold = threshold
        self.cache: List[Dict[str, Any]] = []
        self.model = None # Lazy load

    def _get_model(self):
        if self.model is None:
            self.model = get_sentence_transformer()
        return self.model

    def _cosine_similarity(self, v1: np.ndarray, v2: np.ndarray) -> float:
        return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

    def get(self, query: str) -> Optional[Dict[str, Any]]:
        if not self.cache:
            return None

        model = self._get_model()
        query_vec = model.encode(query)

        best_match = None
        highest_sim = -1.0

        for item in self.cache:
            sim = self._cosine_similarity(query_vec, item["vector"])
            if sim > highest_sim:
                highest_sim = sim
                best_match = item

        if highest_sim >= self.threshold:
            # Update access time for LRU-like eviction if we were using a dict,
            # but here we'll just return it.
            best_match["access_time"] = time.time()
            return best_match["response"]

        return None

    def set(self, query: str, response: Dict[str, Any]):
        model = self._get_model()
        query_vec = model.encode(query)

        if len(self.cache) >= self.size:
            # Evict least recently accessed
            self.cache.sort(key=lambda x: x["access_time"])
            self.cache.pop(0)

        self.cache.append({
            "query": query,
            "vector": query_vec,
            "response": response,
            "access_time": time.time()
        })

# Singleton instance
cache_instance = SemanticCache()
