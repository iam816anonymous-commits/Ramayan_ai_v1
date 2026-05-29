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
        # Example of what we want to prepare:
        # { "Hanuman": {"serves": ["Rama"]}, "Vali": {"brother": ["Sugriva"]} }
        relations = {
            "Rama": {"spouse": ["Sita"], "brother": ["Laxmana", "Bharata", "Shatrughna"]},
            "Sita": {"spouse": ["Rama"]},
            "Hanuman": {"serves": ["Rama"]},
            "Vali": {"brother": ["Sugriva"]},
            "Sugriva": {"brother": ["Vali"]}
        }
        return relations
