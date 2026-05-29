# 10 Frontend User Flow: The Seeker's Journey

## User Flow Diagram
The following diagram illustrates the transition from a user's initial inquiry to the final meditative revelation.

```mermaid
graph TD
    Start([User Enters Sanctum]) --> Input[Whisper Query]
    Input --> Think[Sage Aura Pulses - Thinking State]
    Think --> API{API Response}

    API -->|Intent: Factual/Moral/Personal| Reveal[Revelation Cycle Starts]

    subgraph Sequential_Reveal
        Reveal --> R1[Reflection - 0.5s]
        R1 --> R2[Meaning - 2.5s]
        R2 --> R3[Context - 4.5s]
        R3 --> R4[Takeaway - 6.5s]
        R4 --> R5[Sources & Entities - 8.5s]
    end

    R5 --> Timeline[Timeline Highlight Active Kanda]
    Timeline --> End([User Reflects / Clicks Entity])
```

## Step-by-Step Breakdown

### 1. The Inquiry
The user submits a question via the chat bar at the bottom of the Sanctum. The input field is disabled during processing to maintain the meditative pace.

### 2. Contemplation (Thinking)
The UI enters a `thinking` state.
*   The **Sage Aura** (a blurred gold circle in the background) increases in opacity.
*   **Whisper Particles** move slightly faster.
*   The loading text *"The Sage is contemplating the eternal..."* appears.

### 3. The Revelation
The backend returns a `Revelation` object. The frontend does not show it all at once.
*   **Reflection:** Frames the query in a scriptural context.
*   **Meaning:** Provides the actual answer.
*   **Context:** Validates the answer with Book/Verse references.
*   **Takeaway:** Offers a transformative application for the user's life.

### 4. Journey Anchoring
As the text is revealed, the **Timeline Explorer** at the bottom of the page scrolls or highlights the Kanda from which the revelation was retrieved. This anchors the abstract wisdom in the narrative journey of the Ramayana.

### 5. Deep Exploration
The user can click on individual entity tags (e.g., "Hanuman", "Lanka") in the source attribution section. This opens a modal window showing:
*   The entity's canonical description.
*   Their "Divine Relations" (e.g., "Son of the Wind").
