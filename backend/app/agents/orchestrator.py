from typing import Literal

class Orchestrator:
    def __init__(self):
        self.intents = ["factual", "moral", "personal"]

    def classify_intent(self, query: str) -> Literal["factual", "moral", "personal"]:
        query_lower = query.lower()

        # Factual keywords
        factual_keywords = ["who", "what", "where", "when", "how many", "fact", "history", "son of", "king of", "event", "happened"]
        # Moral keywords
        moral_keywords = ["lesson", "dharma", "moral", "right", "wrong", "virtue", "ethics", "duty", "teach", "meaning"]
        # Personal keywords
        personal_keywords = ["i feel", "lost", "how should i", "my life", "help me", "guide", "sad", "confused", "apply"]

        if any(word in query_lower for word in moral_keywords):
            return "moral"
        elif any(word in query_lower for word in factual_keywords):
            return "factual"
        elif any(word in query_lower for word in personal_keywords):
            return "personal"

        # Default fallback
        return "factual"

    def route_query(self, query: str):
        intent = self.classify_intent(query)
        return intent
