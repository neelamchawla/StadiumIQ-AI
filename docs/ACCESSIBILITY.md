# Accessibility

StadiumIQ-AI is **designed toward WCAG 2.1 Level AA**. Automated axe scans cover key routes in CI; manual screen-reader audits remain recommended before production.

## Automated Testing

```bash
npm run test:e2e -- tests/e2e/accessibility.spec.ts
```

Routes scanned: `/`, `/chat`, `/stadium`, `/accessibility`, `/volunteer`, `/dashboard`.

## Implemented Supports

- Landmarks: `<main id="main-content">`, labeled `<nav>`, skip link
- Chat: labeled textarea, named send button, `aria-live` message log
- Emergency / accessibility AI panels announce results with live regions
- Mobile menu exposes `aria-expanded` / `aria-controls`
- Congestion badges include text labels and `aria-label` (not color alone)
- Home animations respect `useReducedMotion`
- Accessibility needs persist and feed AI context
- Optional browser SpeechRecognition / speechSynthesis where available

## Keyboard

| Shortcut | Action |
|----------|--------|
| ⌘/Ctrl + K | Command palette |
| ⌘/Ctrl + / | Open AI chat |
| Esc | Close command palette |

## Known Gaps

| Area | Status |
|------|--------|
| Automated axe on key routes | Implemented in CI |
| Manual NVDA/VoiceOver audit | Recommended |
| Full RTL layout for Arabic | Partial (language preference only) |
| Google Maps accessible canvas | N/A — CSS stadium map used in demo |

## Reporting Issues

Report barriers via volunteer incident reporting or a GitHub issue labeled `accessibility`.
