from typing import Dict, List, Any

class PersonalAgent:
    def synthesize(self, query: str, context: List[Dict]) -> Dict[str, Any]:
        primary = context[0] if context else {}
        text = primary.get("text", "Peace lies within the heart.")
        kanda = primary.get("kanda", "Ramayana")

        return {
            "reflection": "Your heart seeks resonance with the divine journey. The struggles of the past are but reflections of the struggles within.",
            "meaning": f"Consider how this teaching speaks to your soul: {text[:250]}...",
            "context": f"The Ramayana is a mirror to the human condition, reflected in the trials of {kanda}.",
            "takeaway": "Carry the strength of Hanuman and the grace of Sita within you today. Your journey is part of the greater tapestry of Rama's story.",
            "source_verse": primary.get("shloka_text") or text,
            "meta": {
                "chunks_used": len(context),
                "kanda": kanda,
                "entities": primary.get("entities", {}),
                "verses": [primary.get("verse")],
                "sources": [primary.get("source")]
            }
        }
