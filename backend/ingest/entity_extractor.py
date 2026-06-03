import json
import os
from typing import List, Dict, Set
from functools import lru_cache

class EntityExtractor:
    def __init__(self, knowledge_dir: str = "backend/knowledge"):
        self.knowledge_dir = knowledge_dir
        self.entities = self._load_json("entities.json", {"characters": [], "locations": [], "events": []})
        self.relations = self._load_json("relations.json", [])
        self.aliases = self._load_json("aliases.json", {})

        # Flatten entities for easier lookup
        self.canonical_names = {
            "characters": [c["name"] for c in self.entities.get("characters", [])],
            "locations": [l["name"] for l in self.entities.get("locations", [])],
            "events": [e["name"] for e in self.entities.get("events", [])]
        }

    def _load_json(self, filename: str, default: any) -> any:
        path = os.path.join(self.knowledge_dir, filename)
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return default

    def resolve_entity(self, name: str) -> str:
        name_lower = name.lower()
        # Direct match
        for category in self.canonical_names:
            for canonical in self.canonical_names[category]:
                if name_lower == canonical.lower():
                    return canonical

        # Alias match
        for canonical, aliases in self.aliases.items():
            if name_lower in aliases:
                return canonical.capitalize()
        return name

    def get_relations(self, entity_name: str) -> List[Dict]:
        canonical = self.resolve_entity(entity_name)
        return [r for r in self.relations if r["source"] == canonical or r["target"] == canonical]

    def find_path(self, start_entity: str, end_entity: str) -> List[str]:
        """Finds the shortest relationship path between two entities (BFS)."""
        start = self.resolve_entity(start_entity)
        end = self.resolve_entity(end_entity)

        if start == end:
            return [start]

        # Queue stores paths: [(entity, relation_to_this_entity)]
        queue = [[(start, None)]]
        visited = {start}

        while queue:
            path = queue.pop(0)
            node, _ = path[-1]

            if node == end:
                result = []
                for i in range(len(path) - 1):
                    curr, _ = path[i]
                    nxt, rel_type = path[i+1]
                    result.append(f"{curr} → {rel_type.replace('_', ' ')} → {nxt}")
                return result

            for rel in self.relations:
                if rel["source"] == node and rel["target"] not in visited:
                    visited.add(rel["target"])
                    new_path = list(path)
                    new_path.append((rel["target"], rel["type"]))
                    queue.append(new_path)
                elif rel["target"] == node and rel["source"] not in visited:
                    visited.add(rel["source"])
                    new_path = list(path)
                    new_path.append((rel["source"], f"related to {rel['type']}"))
                    queue.append(new_path)
        return []

    @lru_cache(maxsize=128)
    def _extract_entities_cached(self, text: str):
        found = {
            "characters": [],
            "locations": [],
            "events": []
        }
        text_lower = text.lower()

        for category, names in self.canonical_names.items():
            for name in names:
                if name.lower() in text_lower:
                    found[category].append(name)
                else:
                    canonical_key = name.lower()
                    if canonical_key in self.aliases:
                        for alias in self.aliases[canonical_key]:
                            if alias in text_lower:
                                found[category].append(name)
                                break

        # Consistent ordering for hashing
        for cat in found:
            found[cat] = sorted(list(set(found[cat])))

        # Return as tuple of tuples for immutability (to be safe with lru_cache if needed,
        # though here we are returning a dict which is fine for the result of lru_cache)
        return found

    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        # Dictionary results are fine for lru_cache, but the argument must be hashable (str is fine)
        # We use a helper to ensure the internal logic is cached
        res = self._extract_entities_cached(text)
        # Return a copy to prevent mutation of cached result
        return {k: list(v) for k, v in res.items()}
