# PlaceAI Design System & UI Specification

This guide outlines the visual tokens, typography, and styling guidelines implemented across PlaceAI.

---

## 🎨 Color Palette

### Primary & Accent Colors:
- **Background Deep**: `#0a0f1d` (Core surface)
- **Card Glass Surface**: `rgba(17, 24, 39, 0.75)` with `backdrop-filter: blur(12px)`
- **Border Default**: `rgba(255, 255, 255, 0.08)`
- **Border Hover**: `rgba(139, 92, 246, 0.4)` (Indigo / Purple glow)
- **Primary Brand Gradient**: `linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)`
- **Success / Online Beacon**: `#10b981` / `#34d399`
- **Info / ATS Blue**: `#38bdf8`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`

---

## 📐 Layout & Spacing Rules

1. **Mobile Safe Areas**: Always respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
2. **Fixed Bottom Navigation**: When a bottom tab bar is active, the main container must have `padding-bottom: 96px` to prevent card obstruction.
3. **Card Corner Radii**:
   - Small pills & badges: `border-radius: 20px;`
   - Action Hub cards: `border-radius: 16px;`
   - Hero & modal dialogs: `border-radius: 20px;`

---

## 🔤 Typography

- **Headings**: Modern sans-serif with -0.5px letter-spacing.
- **Body**: 14px / 1.6 line-height in `#94a3b8` / `#cbd5e1` for effortless readability in dark mode.
