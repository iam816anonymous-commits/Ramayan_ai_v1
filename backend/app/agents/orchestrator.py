from typing import Literal

class Orchestrator:
    def __init__(self):
        self.intents = ["factual", "moral", "personal"]

    def classify_intent(self, query: str) -> Literal["factual", "moral", "personal"]:
        query_lower = query.lower()

        # Refined rule-based classification
        if any(word in query_lower for word in ["lesson", "dharma", "moral", "right", "wrong", "virtue", "ethics"]):
            return "moral"
        elif any(word in query_lower for word in ["what", "who", "where", "when", "how many", "fact", "history", "son of", "king of"]):
            return "factual"
        else:
            return "personal"

    def route_query(self, query: str):
        intent = self.classify_intent(query)
        return intent

if __name__ == "__main__":
    orchestrator = Orchestrator()
    print(f"Query: 'Who is Rama?' -> Intent: {orchestrator.route_query('Who is Rama?')}")
    print(f"Query: 'What is the lesson of Aranya Kanda?' -> Intent: {orchestrator.route_query('What is the lesson of Aranya Kanda?')}")
    print(f"Query: 'How can I be more patient like Sita?' -> Intent: {orchestrator.route_query('How can I be more patient like Sita?')}")
