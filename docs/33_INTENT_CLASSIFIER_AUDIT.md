# 33 Intent Classifier Audit: Routing Reliability

## Overview
The `Orchestrator` is responsible for routing queries to the correct agent (Factual, Moral, Personal). It uses a keyword-scoring mechanism.

## Audit Metrics
*   **Total Test Cases:** 180
*   **Intent Accuracy:** **86.67%**
*   **Misclassification Rate:** **13.33%**

## Confusion Matrix

| Actual \ Predicted | Factual | Moral | Personal |
| :--- | :--- | :--- | :--- |
| **Factual** | 158 | 2 | 0 |
| **Moral** | 12 | 8 | 0 |
| **Personal** | 16 | 0 | 4 |

## Primary Failure Patterns

### 1. Personal-to-Factual Drift (Critical)
Many personal queries like "How do I find peace?" or "Give me strength" are routed to the **Factual Agent** because they lack specific keywords like "lost" or "feel".
*   **Impact:** The user gets a dry verse about history instead of a contemplative reflection.

### 2. Moral-to-Factual Overlap
Questions like "How should one act with truth?" are routed as **Factual** because the word "Dharma" or "Lesson" is missing.
*   **Impact:** Misses the grounding of the `MoralAgent` and `dharma_lessons.json`.

### 3. Misspellings Resiliency
The intent classifier is highly resilient to misspellings (e.g., "Who is Ram?") because it relies on substring matching and entity extraction.

## Most Problematic Query Types
1.  **Ambiguous "How" questions:** "How was Ravana defeated?" (Should be Factual) vs "How should I live?" (Should be Personal). The orchestrator struggles to distinguish between "Action History" and "Action Guidance".
2.  **Short emotional queries:** "Help me" or "I am tired" do not trigger the `personal` intent score sufficiently.

## Recommendations
*   **Verb Analysis:** The orchestrator should look for guidance verbs (should, must, can) to trigger the Moral intent.
*   **Threshold Balancing:** The priority hierarchy (Personal > Moral > Factual) is good, but the threshold for Personal needs to be lowered for high-sentiment words.
*   **Entity Impact:** If a query contains a character name AND a "how" verb, it should default to Factual unless a virtue keyword is present.
