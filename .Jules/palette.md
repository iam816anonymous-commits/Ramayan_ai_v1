## 2025-05-15 - [SSR Purity and Hydration]
**Learning:** Next.js 16/React 19 strictly enforces purity during render. Using `Math.random()` in `useMemo` or the render body causes hydration mismatches and lint errors.
**Action:** Move dynamic/random data generation to `useEffect` and store in state, even if it causes a single cascading render, to ensure SSR consistency.

## 2025-05-15 - [Accessible Chat History]
**Learning:** In a side-panel chat history, users need to know which item is active and have a clear label for what clicking the history item does.
**Action:** Use `aria-pressed` to indicate the active chat item and `aria-label` to describe the action (e.g., "View response for: [content]").
