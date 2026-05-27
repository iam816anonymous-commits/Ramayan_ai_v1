from typing import Dict, Any

class SageAgent:
    def __init__(self):
        pass

    def format_response(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Formats the output into the structured 'Revelation' format.
        """
        return {
            "reflection": raw_data.get("reflection", ""),
            "meaning": raw_data.get("meaning", ""),
            "context": raw_data.get("context", ""),
            "takeaway": raw_data.get("takeaway", "")
        }

    def get_full_response(self, query: str, brain_response: Dict[str, Any], intent: str) -> Dict[str, Any]:
        revelation = self.format_response(brain_response)

        return {
            "answer": brain_response.get("meaning", ""), # Legacy support if needed
            "agent": f"{intent.capitalize()} Agent",
            "intent": intent,
            "meta": brain_response.get("meta", {}),
            "revelation": revelation,
            "source_verse": brain_response.get("source_verse", "")
        }
