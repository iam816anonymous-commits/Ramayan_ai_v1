from typing import Literal

class Orchestrator:
    def __init__(self):
        self.intents = ["factual", "moral", "personal"]

    def classify_intent(self, query: str) -> Literal["factual", "moral", "personal"]:
        query_lower = query.lower()

        # Factual keywords (High specificity for names and locations)
        factual_keywords = [
            "who", "what", "where", "when", "how many", "fact", "history",
            "son of", "king of", "event", "happened", "describe", "detail",
            "relationship", "parent", "birth", "death", "battle", "war", "city", "forest",
            "tell me about", "story of", "biography"
        ]
        # Moral keywords (Philosophical and ethical themes)
        moral_keywords = [
            "lesson", "dharma", "moral", "right", "wrong", "virtue", "ethics",
            "duty", "teach", "meaning", "wisdom", "righteousness", "truth",
            "consequence", "action", "choice", "symbolism", "allegory", "leadership", "devotion"
        ]
        # Personal keywords (Emotional, introspective, and application-focused)
        personal_keywords = [
            "i feel", "lost", "how should i", "what should i", "my life", "help me", "guide",
            "sad", "confused", "apply", "burden", "struggle", "advice",
            "inspiration", "motivation", "peace", "grief", "fear", "anxious",
            "failure", "failed", "success", "my path", "my journey", "i need", "i am", "help",
            "troubled", "facing", "deal with", "handle", "lonely", "hopeless", "uncertain"
        ]

        # Score-based classification for mixed intents
        # Weighted scoring: Personal has highest weight to prevent drift to factual
        f_score = sum(1 for word in factual_keywords if word in query_lower)
        m_score = sum(1.3 for word in moral_keywords if word in query_lower)
        p_score = sum(1.8 for word in personal_keywords if word in query_lower)

        # Priority and threshold based classification
        if p_score >= 1.5 and p_score >= m_score and p_score >= f_score:
            return "personal"
        if m_score >= 1.2 and m_score >= f_score:
            return "moral"

        # If "lesson" is in query, even if other factual words exist, prefer moral if score > 0
        if "lesson" in query_lower and m_score > 0:
            return "moral"

        if f_score > 0:
            return "factual"

        # Default fallback
        return "factual"

    def route_query(self, query: str):
        intent = self.classify_intent(query)
        return intent
