from typing import Dict

class RelationshipFormatter:
    def __init__(self):
        self.templates = {
            "father_of": "{source} is the father of {target}",
            "mother_of": "{source} is the mother of {target}",
            "brother_of": "{source} is the brother of {target}",
            "sister_of": "{source} is the sister of {target}",
            "spouse_of": "{source} is the spouse of {target}",
            "husband_of": "{source} is the husband of {target}",
            "wife_of": "{source} is the wife of {target}",
            "enemy_of": "{source} is the enemy of {target}",
            "guru_of": "{source} is the teacher of {target}",
            "disciple_of": "{source} is the disciple of {target}",
            "ally_of": "{source} is an ally of {target}",
            "king_of": "{source} is the king of {target}",
            "servant_of": "{source} is the servant of {target}",
            "devotee_of": "{source} is a devotee of {target}",
            "son_of": "{source} is the son of {target}",
            "nephew_of": "{source} is the nephew of {target}"
        }

    def format(self, source: str, edge: str, target: str) -> str:
        # Clean edge: remove "related to " prefix if it exists from BFS logic
        clean_edge = edge.replace("related to ", "").strip()

        template = self.templates.get(clean_edge)

        if template:
            # Check if it was an inverse relation (detected by prefix)
            if "related to" in edge:
                 # Swap source and target for natural flow if template doesn't fit?
                 # Actually the BFS return already has them in the right order for the edge returned.
                 # Let's just use the template.
                 return template.format(source=source, target=target)
            return template.format(source=source, target=target)

        # Fallback
        return f"{source} is connected to {target} through {clean_edge.replace('_', ' ')}."
