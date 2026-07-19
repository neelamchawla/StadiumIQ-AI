# Testing Guide

## Overview

| Layer | Tool | Location |
|-------|------|----------|
| Unit | Vitest | `tests/unit/` |
| Component | Vitest + Testing Library | `tests/components/` |
| E2E / a11y | Playwright + axe | `tests/e2e/` |

CI runs typecheck, lint, unit tests, and Playwright Chromium e2e via `.github/workflows/ci.yml`.

## Commands

```bash
npm test
npm run test:watch
npm run test:coverage
npx playwright install chromium   # first time
npm run test:e2e
npm run typecheck
npm run lint
```

## What Is Covered

- Sanitization & rate limiting utilities
- Chat schema allowlist (rejects unknown context keys)
- Stadium context builder & best-gate recommendations
- Incident store (volunteer → organizer)
- API routes: `/api/ai/chat`, `/api/ai/generate` (410), `/api/health`
- Real `CongestionBadge` component
- E2E: home title, navigation, best-gate hero, volunteer form, axe on key routes

## Coverage Reality

Coverage targets are aspirational. Prefer meaningful path tests (AI wiring, validation, incidents, a11y) over chasing a percentage. Run `npm run test:coverage` locally to inspect gaps.
