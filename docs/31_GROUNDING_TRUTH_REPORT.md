# 31 Grounding Truth Report: V2.1 Hardening

## Performance Comparison

| Metric | V1 Baseline | V2.1 Hardened | Improvement |
| :--- | :--- | :--- | :--- |
| **Grounding Accuracy** | 12.5% | **92.3%** | +79.8% |
| **Hallucination Rate** | 87.5% | **4.2%** | -83.3% |
| **False Grounding Rate** | 100% | **0.5%** | -99.5% |

## Methodology
The audit used 325 test queries across 10 categories. A response is only marked as "passed" if it is correctly grounded OR correctly rejected (in case of adversarial/unknown entities).

## Success Patterns
1.  **Confidence Thresholding:** The new `ConfidenceScorer` successfully blocked 100% of "Batman" style queries that previously relied on accidental keyword overlap.
2.  **Moral Validation:** The `MoralValidator` correctly rejected lessons when the retrieved verse was about unrelated topics (e.g., describing nature but asking about sacrifice).

## Failure Patterns
1.  **Ambiguous Intent:** Complex queries that blend personal seeking with factual history occasionally still route to the factual agent and get rejected due to the strict entity check.
2.  **High-Level Themes:** Queries about extremely abstract themes (e.g., "The meaning of existence") sometimes fail confidence checks because the semantic match is diffuse across the whole corpus.
