from typing import List, Dict, Set

class EntityExtractor:
    def __init__(self):
        self.aliases = {
            "bali": ["bali", "vali"],
            "vasishtha": ["vasistha", "vasista", "vashishta"],
            "angada": ["angadha", "angada"],
            "rama": ["rama", "ram", "raghava"],
            "sita": ["sita", "seetha", "maithili", "janaki"],
            "hanuman": ["hanuman", "hanumana", "anjaneya", "maruti"],
            "sugriva": ["sugriva", "sugreeva"],
            "ayodhya": ["ayodhya", "ayodhyaa"],
            "lanka": ["lanka", "lankaa"],
            "kishkindha": ["kishkindha", "kishkinda"]
        }

        self.entities = {
            "characters": ["Rama", "Sita", "Hanuman", "Vali", "Sugriva", "Angada", "Vasistha", "Laxmana", "Bharata", "Shatrughna", "Ravana"],
            "locations": ["Ayodhya", "Lanka", "Kishkindha", "Dandaka", "Mithila", "Chitrakoot", "Panchavati"],
            "events": ["Exile", "War", "Bridge", "Abduction", "Swayamvara", "Coronation"]
        }

    def resolve_entity(self, name: str) -> str:
        name_lower = name.lower()
        for canonical, aliases in self.aliases.items():
            if name_lower == canonical or name_lower in aliases:
                return canonical.capitalize()
        return name

    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        found = {
            "characters": [],
            "locations": [],
            "events": []
        }
        text_lower = text.lower()

        for category, names in self.entities.items():
            for name in names:
                if name.lower() in text_lower:
                    found[category].append(name)
                else:
                    # Check aliases
                    canonical = name.lower()
                    if canonical in self.aliases:
                        for alias in self.aliases[canonical]:
                            if alias in text_lower:
                                found[category].append(name)
                                break

        # Remove duplicates
        for cat in found:
            found[cat] = list(set(found[cat]))

        return found
