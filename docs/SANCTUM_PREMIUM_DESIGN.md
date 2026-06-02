# Sanctum Premium Divine Experience: Design Specification

## 1. Core Philosophy: "Sit → Ask → Reflect"
Sanctum is not a utility; it is a space. The UI must feel like a quiet temple at dawn. Every interaction should be intentional, slow, and weighted with significance.

## 2. Visual System

### 2.1 Color Palette
- **Primary (The Void):** `#050505` (Deep Obsidian)
- **Accent (The Divine):** `#D4AF37` (Metallic Gold)
- **Secondary (The Mists):** `#1A1A1A` (Charcoal Grey)
- **Highlight (The Truth):** `#FDFCF0` (Antique Ivory)
- **Glow:** `rgba(212, 175, 55, 0.15)` (Radiant Gold)

### 2.2 Typography
- **Headings (Divine Titles):** `Cinzel` or `Playfair Display` (Serif, High Contrast, Uppercase, Spaced)
- **Body (Revelations):** `Lora` or `EB Garamond` (Serif, Elegant, Readable)
- **Metadata (Scriptural Refs):** `Inter` (Sans-Serif, Light, Tracking 0.2em)

### 2.3 Sacred Geometry
- Implementation of overlapping circles (Flower of Life) or rotating Mandalas in the background.
- SVG-based, low-opacity, slowly rotating (120s per rotation).

## 3. Motion System (Framer Motion)
- **Breathing Aura:** 8s duration, `ease: "easeInOut"`, scale `1.0` to `1.05`.
- **Sequential Revelation:**
  - Reflection: 0s
  - Meaning: 3s
  - Context: 6s
  - Takeaway: 9s
- **Page Transitions:** Soft cross-fade (1.5s).

## 4. Component Hierarchy

### 4.1 `SagePresence`
- The central orb.
- Combines `WhisperParticles`, `SacredGeometry`, and the `Aura`.
- Positioned as the constant horizon of the application.

### 4.2 `RevelationDisplay`
- Replaces the "Chat" history.
- Only shows the *Current* wisdom.
- Past queries are accessible via a subtle "Echoes" thread or just cleared to maintain minimalism.

### 4.3 `DivineTimeline`
- A vertical or horizontal journey line.
- Museum-style labels (Bala, Ayodhya, etc.).
- Active Kanda glows with a soft pulse.

## 5. Mobile Adaptation
- Full-screen immersive mode.
- Gesture-based navigation (Swipe to see Timeline).
- Bottom-docked subtle input bar.

## 6. Performance Considerations
- Use `will-change` for CSS transforms.
- Optimize SVGs to paths.
- Ensure `useMemo` for particle positions.
