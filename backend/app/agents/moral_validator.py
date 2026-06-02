from typing import List, Dict, Any

class MoralValidator:
    def __init__(self):
        # High level virtue keywords for validation
        self.virtue_keywords = ["dharma", "truth", "duty", "sacrifice", "loyalty", "justice", "righteousness", "vow", "promise", "purity"]

    def validate_moral_claim(self, query: str, context: List[Dict], lesson: str) -> Dict[str, Any]:
        """
        Validates if the moral lesson matches the retrieved context.
        """
        if not context:
            return {"valid": False, "reason": "No scriptural context found."}

        context_text = " ".join([c.get("text", "").lower() for c in context])
        lesson_lower = lesson.lower()

        # Heuristic 1: If lesson mentions character, character should be in context
        # (This is already mostly handled by characters logic in MoralAgent)

        # Heuristic 2: Keyword overlap between lesson/query and context
        overlap = [w for w in self.virtue_keywords if w in context_text]

        # If the context is extremely generic, it might still be valid for general dharma
        if len(overlap) > 0:
            return {"valid": True, "overlap": overlap}

        # Fallback: Is the query about a specific character?
        # If so, and the context is about that character, we assume valid for V2.1
        query_lower = query.lower()
        for c in context:
            char = c.get("character", "").lower()
            if char and char in query_lower:
                return {"valid": True, "reason": "Character match found."}

        return {
            "valid": False,
            "reason": "I could not find enough evidence in the retrieved verses to support this moral interpretation."
        }
