from typing import List, Dict, Any

class ConfidenceScorer:
    def __init__(self):
        pass

    def calculate(self, context: List[Dict], intent: str, entities_found: Dict[str, List[str]]) -> float:
        """
        Calculates a confidence score between 0.0 and 1.0.
        """
        if not context:
            return 0.0

        primary = context[0]

        # 1. Retrieval Score (Cosine Similarity)
        # Typically MiniLM scores are between 0.3 and 0.8 for good matches
        retrieval_score = primary.get("score", 0.0)

        # 2. Rerank Score (Cross Encoder)
        # MS-Marco Cross Encoder scores are often on a different scale, but usually > 0 for relevance
        rerank_score = primary.get("rerank_score", -10.0)
        import math
        # Normalize rerank: map -5..5 to 0..1 roughly using sigmoid
        normalized_rerank = 1.0 / (1.0 + math.exp(-rerank_score))

        # 3. Entity Alignment
        entity_weight = 0.0
        if entities_found["characters"]:
            # If the primary chunk character matches one of the query characters
            primary_char = primary.get("character", "").lower()
            if any(c.lower() in primary_char for c in entities_found["characters"]):
                entity_weight = 1.0
            elif any(primary_char in c.lower() for c in entities_found["characters"]):
                entity_weight = 0.8
        else:
            # If no entities in query, we don't penalize as much
            entity_weight = 0.5

        # Weighted Confidence
        # Retrieval (30%) + Rerank (40%) + Entity (30%)
        confidence = (retrieval_score * 0.3) + (normalized_rerank * 0.4) + (entity_weight * 0.3)

        # Intent adjustment
        if intent in ["personal", "moral"]:
            # These agents are more "guided" and less "retrieval-critical"
            confidence += 0.2

        return min(round(confidence, 2), 1.0)
