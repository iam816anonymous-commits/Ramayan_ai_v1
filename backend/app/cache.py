import functools
from typing import Dict, Any, Optional
import time

class SemanticCache:
    def __init__(self, size: int = 100):
        self.size = size
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.access_times: Dict[str, float] = {}

    def get(self, query: str) -> Optional[Dict[str, Any]]:
        query = query.strip().lower()
        if query in self.cache:
            self.access_times[query] = time.time()
            return self.cache[query]
        return None

    def set(self, query: str, response: Dict[str, Any]):
        query = query.strip().lower()
        if len(self.cache) >= self.size:
            # Evict oldest
            oldest = min(self.access_times, key=self.access_times.get)
            del self.cache[oldest]
            del self.access_times[oldest]

        self.cache[query] = response
        self.access_times[query] = time.time()

# Singleton instance
cache_instance = SemanticCache()
