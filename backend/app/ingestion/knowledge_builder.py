from typing import List, Dict
from .entity_extractor import EntityExtractor

class KnowledgeBuilder:
    def __init__(self):
        self.extractor = EntityExtractor()

    def enrich_item(self, item: Dict) -> Dict:
        """
        Enriches a single item with extracted entities.
        """
        text = item.get("text", "")
        entities = self.extractor.extract_entities(text)
        item["entities"] = entities
        return item

    def build_relations(self, unified_objects: List[Dict]) -> Dict:
        """
        Builds a dynamic relation map using the extractor's relations.
        """
        raw_relations = self.extractor.relations
        dynamic_relations = {}

        for rel in raw_relations:
            source = rel["source"]
            target = rel["target"]
            rel_type = rel["type"]

            if source not in dynamic_relations:
                dynamic_relations[source] = {}

            if rel_type not in dynamic_relations[source]:
                dynamic_relations[source][rel_type] = []

            if target not in dynamic_relations[source][rel_type]:
                dynamic_relations[source][rel_type].append(target)

        return dynamic_relations
