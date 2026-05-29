from typing import List, Dict, Any

class PersonalReasoner:
    def __init__(self):
        self.themes = {
            "fear": {
                "episode": "Hanuman's Leap over the Ocean",
                "lesson": "Faith in one's purpose overcomes the vastest obstacles.",
                "application": "When facing failure, remember that Hanuman's strength came from his devotion and clarity of purpose, not just physical power."
            },
            "grief": {
                "episode": "Rama's mourning for Sita in Aranya Kanda",
                "lesson": "Even the divine experience deep sorrow, showing it is a part of the human condition.",
                "application": "Allow yourself to feel, but like Rama, eventually find the strength to continue the journey towards righteousness."
            },
            "loss": {
                "episode": "The death of Jatayu",
                "lesson": "Noble sacrifice in the face of loss immortalizes the spirit.",
                "application": "Focus on the integrity of your actions rather than the permanence of what was lost."
            },
            "purpose": {
                "episode": "Rama's exile to fulfill Dasharatha's word",
                "lesson": "Dharma (duty) is the compass that guides one through the unknown.",
                "application": "Align your choices with your core values, even if they lead you away from comfort."
            },
            "loneliness": {
                "episode": "Sita in the Ashoka Vatika",
                "lesson": "Inner strength and unwavering focus can sustain a soul in isolation.",
                "application": "In solitude, nurture your connection to the divine or your highest ideals."
            },
            "anger": {
                "episode": "Laxmana's reaction to Rama's exile",
                "lesson": "Righteous indignation must be tempered by wisdom and the guidance of the steady-minded.",
                "application": "Listen to the calm voice within before acting on the fires of passion."
            },
            "confusion": {
                "episode": "Sugriva's doubt before the alliance",
                "lesson": "Friendship with the wise clears the fog of uncertainty.",
                "application": "Seek guidance from those who embody the values you aspire to."
            },
            "failure": {
                "episode": "The first unsuccessful attempts to cross to Lanka",
                "lesson": "Persistence and collective effort turn failure into a bridge of victory.",
                "application": "Analyze the cause of setback, gather your allies, and build your bridge one stone at a time."
            },
            "discipline": {
                "episode": "The ascesis of the sages in Dandaka",
                "lesson": "Strict adherence to a path leads to transcendental power.",
                "application": "Small, consistent daily practices build the foundation for great shifts in life."
            },
            "hope": {
                "episode": "The sight of Rama's ring given to Sita by Hanuman",
                "lesson": "A single token of truth can dispel a mountain of despair.",
                "application": "Hold onto small signs of progress and truth when the darkness feels overwhelming."
            }
        }

    def detect_theme(self, query: str) -> str:
        q = query.lower()
        for theme in self.themes:
            if theme in q:
                return theme

        # Fallbacks for synonyms
        if "sad" in q or "pain" in q or "hurt" in q: return "grief"
        if "worry" in q or "anxious" in q or "scared" in q: return "fear"
        if "where" in q or "what" in q and "do" in q: return "confusion"

        return "purpose" # Default theme

    def reason(self, query: str, context: List[Dict]) -> Dict[str, Any]:
        theme_key = self.detect_theme(query)
        theme_data = self.themes[theme_key]

        primary_verse = context[0] if context else {"text": "Dharma is subtle and eternal.", "kanda": "Universal", "verse": "N/A"}

        return {
            "reflection": f"In the forest of life, we often encounter echoes of the {theme_key} that the great souls once faced.",
            "meaning": f"The episode of {theme_data['episode']} teaches us that {theme_data['lesson']}",
            "context": f"This wisdom is rooted in the {primary_verse.get('kanda', 'Ramayana')}. {theme_data['episode']} illustrates the path through {theme_key}.",
            "takeaway": theme_data['application'],
            "source_verse": primary_verse.get("text", "")
        }
