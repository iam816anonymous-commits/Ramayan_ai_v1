from typing import Dict, List, Any

class PersonalAgent:
    def synthesize(self, query: str, context: List[Dict]) -> Dict[str, Any]:
        primary = context[0] if context else {}
        text = primary.get("text", "Peace lies within the heart.")
        kanda = primary.get("kanda", "Ramayana")
        chars = primary.get("entities", {}).get("characters", [])

        # Simple emotion detection
        q = query.lower()
        if any(word in q for word in ["lost", "confused", "direction", "where"]):
            reflection = "The forest of life is dense, yet every soul is a seeker. Your inquiry into the sacred verses suggests that the path is already beginning to reveal itself to you."
        elif any(word in q for word in ["sad", "pain", "hurt", "suffering", "grief"]):
            reflection = "Even the heavens wept for the separation of the divine. Your sorrow is a bridge to the universal heart, echoing the trials of the great souls."
        elif any(word in q for word in ["fear", "scared", "anxious", "worry"]):
            reflection = "The bridge was built on faith, not on stone alone. Let the Sage remind you that even the greatest warriors trembled before their duty, yet they stepped forward."
        else:
            reflection = "Your heart seeks resonance with the divine journey. The struggles of the past are but reflections of the struggles within."

        if chars:
            reflection = f"{reflection} Just as {chars[0]} navigated the trials of {kanda}, your own path is illuminated by their divine example."

        return {
            "reflection": reflection,
            "meaning": f"In the stillness, consider this: '{text[:200]}...' This moment in the {kanda} reflects the universal challenges we all face.",
            "context": f"The Ramayana is a mirror to the human condition. We find ourselves in the stories of {', '.join(chars) or 'the divine souls'} in the {kanda}.",
            "takeaway": "Carry the wisdom of this revelation in your heart. Remember that even the avatar faced shadows, yet remained steadfast in Dharma.",
            "source_verse": primary.get("shloka_text") or text,
            "meta": {
                "chunks_used": len(context),
                "kanda": kanda,
                "entities": primary.get("entities", {"characters": [], "locations": [], "events": []}),
                "verses": [str(primary.get("verse", "various"))],
                "sources": [primary.get("source", "Scriptures")]
            }
        }
