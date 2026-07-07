# Accessibility Compliance

FIFA Stadium Intelligence AI is designed to meet **WCAG 2.1 Level AA** guidelines, supporting fans with diverse accessibility needs.

## Automated Testing

Accessibility is validated in CI via Playwright + `@axe-core/playwright`:

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.ts
```

The scan checks against WCAG 2.0/2.1 tags (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`).

## Semantic HTML

- Pages use proper heading hierarchy (`h1` → `h2` → …)
- `<main>`, `<nav>`, and `<header>` landmarks are present
- Navigation links use descriptive text labels
- Forms use associated `<label>` elements (Radix UI Label)

## Keyboard Navigation

- All interactive elements are focusable
- Radix UI components provide built-in keyboard support (dialogs, tabs, dropdowns)
- Keyboard shortcuts documented in `KEYBOARD_SHORTCUTS` constant

## Screen Reader Support

- AI Accessibility Assistant feature provides voice-friendly responses
- Semantic landmarks help screen reader navigation
- Icon-only buttons should include `aria-label` (enforce in component reviews)

## Visual Design

- Color contrast follows Tailwind design tokens with light/dark mode support
- Congestion levels use both color and text labels (not color alone)
- `prefers-reduced-motion` respected via `prefersReducedMotion()` utility

## AI Accessibility Feature

The dedicated `accessibility` AI feature provides:

- Wheelchair route guidance
- Visual impairment audio descriptions
- Hearing impairment text-based alerts
- Mobility assistance rest area locations

## Multilingual Support

Nine languages supported via `supportedLanguagesSchema`:

English, Spanish, French, German, Portuguese, Arabic, Chinese, Japanese, Korean

## Accessibility Needs Schema

User profiles can specify:

- Wheelchair access
- Visual impairment
- Hearing impairment
- Mobility assistance
- Companion required

These feed into route recommendation and AI assistant context.

## Known Gaps & Roadmap

| Area | Status | Plan |
|------|--------|------|
| Automated axe scans | ✅ Implemented | Run in CI |
| Manual screen reader testing | 🔄 Planned | NVDA/VoiceOver audit |
| Live regions for AI chat | 🔄 Planned | `aria-live="polite"` on responses |
| Focus management in dialogs | ✅ Radix default | Verify custom dialogs |
| PWA offline support | 🔄 Planned | Service worker + manifest |

## Reporting Issues

If you encounter an accessibility barrier, please report it via the incident reporting feature or open a GitHub issue with the `accessibility` label.
