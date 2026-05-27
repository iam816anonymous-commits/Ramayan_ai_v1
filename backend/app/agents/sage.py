from typing import Dict

class SageAgent:
    def __init__(self):
        pass

    def format_response(self, raw_data: Dict) -> str:
        """
        Transforms raw intelligence into the structured 'Sanctum' format:
        Reflection -> Meaning -> Context -> Takeaway
        """
        reflection = raw_data.get("reflection", "Behold the wisdom of the ages.")
        meaning = raw_data.get("meaning", "The essence of this teaching lies in the path of Dharma.")
        context = raw_data.get("context", "In the sacred verses of the Ramayana, we find this truth.")
        takeaway = raw_data.get("takeaway", "Carry this light in your heart as you walk your journey.")

        formatted = (
            f"### Reflection\n{reflection}\n\n"
            f"### Meaning\n{meaning}\n\n"
            f"### Context\n{context}\n\n"
            f"### Takeaway\n{takeaway}"
        )
        return formatted

if __name__ == "__main__":
    sage = SageAgent()
    sample_data = {
        "reflection": "The strength of Rama lies not in his bow, but in his unwavering commitment to Truth.",
        "meaning": "Dharma is not merely a set of rules, but the alignment of one's soul with the cosmic order.",
        "context": "When Dasharatha was bound by his promise, Rama accepted exile to preserve his father's honor.",
        "takeaway": "Even in times of great loss, staying true to your word is the highest form of courage."
    }
    print(sage.format_response(sample_data))
