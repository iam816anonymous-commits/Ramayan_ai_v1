# 36 Moral Agent Evaluation: Ethical Grounding

## Overview
The `MoralAgent` is tasked with providing grounded ethical insights by matching user queries to a curated set of `dharma_lessons.json` and synthesizing them with retrieved context.

## Scorecard

| Metric | Score | Justification |
| :--- | :--- | :--- |
| **Grounding** | 45/100 | Lessons are often generic and not specifically tied to the *retrieved* verse. |
| **Relevance** | 75/100 | Keyword matching for "Dharma", "Duty", etc., is reliable. |
| **Practicality** | 80/100 | The "Takeaway" section provides actionable advice. |
| **Consistency** | 90/100 | The persona remains stable and authoritative. |

## Evaluation of Moral Reasoning

### 1. The "Grounding Replacement" Logic
The agent attempts to ground lessons by replacing generic pronouns:
*   *Implementation:* `replace("one's", f"{chars[0]}'s")`
*   *Assessment:* **Highly Effective.** This simple heuristic significantly increases the perceived intelligence of the system. (e.g., "Dharma is the alignment of Rama's soul...").

### 2. Matching Accuracy
*   **Success:** Queries like "What is Dharma?" perfectly match the general Dharma lesson.
*   **Failure:** Specific ethical questions like "Why did Rama kill Vali?" often fail to find a nuanced lesson and default to the general "Dharma is subtle" template.

## Strengths
*   The system avoids modern ethical biases by relying on a curated scriptural lesson set.
*   Sequential reveal makes the "Meaning" and "Takeaway" feel earned.

## Weaknesses
*   **Sparse Knowledge:** `dharma_lessons.json` is too small (~10 lessons) to handle the complexity of the Ramayana's moral dilemmas.
*   **Context Disconnect:** If the retrieved verse is about Rama's birth, but the matched lesson is about "Sacrifice," the agent will present the "Sacrifice" lesson despite the verse being irrelevant.

## Recommendations
1.  **Triple the Lesson Base:** Expand `dharma_lessons.json` to include 50+ specific dilemmas (e.g., Vali's death, Sita's trial, Vibhishana's defection).
2.  **Kanda-Aware Matching:** Only allow moral lessons from the same Kanda as the retrieved context to be synthesized.
3.  **Virtue Extraction:** Extract specific virtues (loyalty, truth, courage) from document chunks during ingestion to allow for better "Moral RAG".
