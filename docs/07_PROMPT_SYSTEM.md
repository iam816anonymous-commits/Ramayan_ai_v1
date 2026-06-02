# 07 Prompt System: Sacred Instruction

## Overview
Unlike typical RAG applications that use large, complex system prompts for an LLM, Sanctum V1 uses **Deterministic Prompt Engineering**. The responses are synthesized using structured templates that ensure the "Sage" persona remains consistent and scripturally grounded.

## Grounding Strategy
Every response is built from the ground up using retrieved scriptural segments. The synthesis logic in `brain.py`, `moral_agent.py`, and `personal_agent.py` acts as a "hardcoded prompt" to prevent hallucinations.

## Execution Chain

### 1. Intent Detection Prompt (Keyword-Based)
The `Orchestrator` uses score-based logic rather than an LLM prompt for speed and determinism.
*   *Keywords:* "lost", "sad", "feel" → Intent: **Personal**
*   *Keywords:* "lesson", "duty", "virtue" → Intent: **Moral**
*   *Keywords:* "who", "where", "what" → Intent: **Factual**

### 2. Reflection Prompt (Template-Based)
The `PersonalAgent` selects reflections based on detected emotions:
*   **Fear:** *"The bridge was built on faith, not on stone alone..."*
*   **Loss:** *"The forest of life is dense, yet every soul is a seeker..."*
*   **General:** *"Your heart seeks resonance with the divine journey..."*

### 3. Synthesis Prompt (The "Thread of Fate")
When character paths are found, the system generates a poetic bridge:
*"The Thread of Fate reveals how {char1} is connected to {char2} by being the {relation} of {target}. Their destinies are eternally entwined."*

### 4. Grounding Prompt (The Moral Replacement)
The `MoralAgent` performs a post-processing replacement to ground general wisdom into specific context:
*   *Template:* "Dharma is the alignment of **one's** soul..."
*   *Grounded:* "Dharma is the alignment of **Rama's** soul..."

## Hallucination Prevention
To prevent the Sage from "guessing," the system uses a Fallback Prompt:
*"The sacred silence holds all answers. Even when the path is not immediately clear, Dharma guides us."*

## Future Refinement
In V2.0, these deterministic templates will be replaced with dynamic LLM prompts (e.g., using Gemini or GPT-4o) that use the current templates as "One-Shot" examples to maintain the persona while increasing linguistic variety.
