from typing import Dict, Any
from .entity_extractor import EntityExtractor

class MetadataBuilder:
    def __init__(self):
        self.extractor = EntityExtractor()

    def build(self, item: Dict[str, Any]) -> Dict[str, Any]:
        text = item.get("text", "")
        entities = self.extractor.extract_entities(text)

        unified_object = {
            "text": text,
            "character": ", ".join(entities["characters"]),
            "kanda": item.get("kanda", ""),
            "chapter": item.get("chapter", ""),
            "verse": item.get("verse", ""),
            "theme": "", # Future extraction
            "speaker": "", # Future extraction
            "location": ", ".join(entities["locations"]),
            "source": item.get("source", ""),
            "entities": entities
        }
        return unified_object
