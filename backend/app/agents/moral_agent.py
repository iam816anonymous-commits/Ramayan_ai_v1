from typing import Dict, List, Any

class MoralAgent:
    def synthesize(self, query: str, context: List[Dict]) -> Dict[str, Any]:
        primary = context[0] if context else {}
        text = primary.get("text", "The path of Dharma is subtle.")
        kanda = primary.get("kanda", "Ramayana")

        return {
            "reflection": "Every action in the cosmic play carries a weight of Dharma. We must look beyond the surface of the event to find the eternal law.",
            "meaning": f"The moral teaching revealed here is: {text[:300]}...",
            "context": f"In this chapter of {kanda}, we observe the choices of the great souls and the consequences that ripple through time.",
            "takeaway": "Dharma is not merely a set of rules, but the alignment of one's soul with the cosmic order. Choose the path of righteousness even when it is the narrowest one.",
            "source_verse": primary.get("shloka_text") or text,
            "meta": {
                "chunks_used": len(context),
                "kanda": kanda,
                "entities": primary.get("entities", {}),
                "verses": [primary.get("verse")],
                "sources": [primary.get("source")]
            }
        }
