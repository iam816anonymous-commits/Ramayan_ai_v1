from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from typing import List, Dict

class BrainAgent:
    def __init__(self, collection_name="ramayana_v1"):
        self.client = QdrantClient(":memory:")
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def retrieve_context(self, query: str, top_k: int = 3) -> List[Dict]:
        vector = self.model.encode(query).tolist()
        search_result = self.client.query_points(
            collection_name=self.collection_name,
            query=vector,
            limit=top_k
        ).points
        return [hit.payload for hit in search_result]

    def synthesize_response(self, query: str, context: List[Dict], intent: str) -> Dict:
        primary_verse = context[0] if context else {}
        text = primary_verse.get("text", "The sacred silence holds all answers.")
        translation = primary_verse.get("translation", "")
        explanation = primary_verse.get("explanation", "")

        if intent == "factual":
            reflection = f"You seek knowledge of the events that transpired. {explanation[:100]}..."
            meaning = f"The factual essence of this moment is captured in the verse: {text}"
            context_str = f"This took place in the {primary_verse.get('kanda', 'Ramayana')}, Sarga {primary_verse.get('sarga', 'unknown')}."
            takeaway = "Knowledge of the past illuminates the path to the future."
        elif intent == "moral":
            reflection = "Every action in the cosmic play carries a weight of Dharma."
            meaning = f"The moral teaching here is: {translation[:150]}..."
            context_str = f"In this chapter, we observe the choices of the great souls. {explanation[:100]}..."
            takeaway = "Choose the path of righteousness even when it is the narrowest one."
        else: # personal
            reflection = "Your heart seeks resonance with the divine journey."
            meaning = f"Consider how this teaching speaks to your soul: {translation[:100]}..."
            context_str = "The Ramayana is a mirror to the human condition."
            takeaway = "Walk with the grace of Sita and the strength of Rama in your daily life."

        return {
            "reflection": reflection,
            "meaning": meaning,
            "context": context_str,
            "takeaway": takeaway,
            "source_verse": text
        }
