# Testing Guide

## Overview

The project uses a three-tier testing strategy:

| Layer | Tool | Location |
|-------|------|----------|
| Unit | Vitest | `tests/unit/` |
| Component | Vitest + Testing Library | `tests/components/` |
| E2E | Playwright | `tests/e2e/` |

## Running Tests

```bash
# All unit & component tests
npm test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage

# End-to-end tests (starts dev server automatically)
npm run test:e2e

# Type checking
npm run typecheck
```

## Unit Tests

### `tests/unit/lib/sanitize.test.ts`

Tests HTML escaping and prompt input sanitization:

- `escapeHtml` — XSS prevention for special characters
- `sanitizePromptInput` — Trimming, length limits, injection pattern removal

### `tests/unit/lib/rate-limit.test.ts`

Tests the in-memory rate limiter:

- Requests within limit succeed
- Excess requests are blocked
- Window expiry resets counters
- Independent tracking per identifier

Uses `vi.useFakeTimers()` and `resetRateLimitStore()` for deterministic tests.

### `tests/unit/lib/utils.test.ts`

Tests formatting utilities:

- `formatWaitTime` — Human-readable wait durations
- `formatDistance` — Meters vs kilometers
- `getCongestionColor` — Tailwind classes per congestion level

### `tests/unit/schemas/chat.test.ts`

Tests `chatRequestSchema` validation:

- Valid requests with defaults
- Empty/oversized message rejection
- Invalid language and UUID rejection
- Optional context acceptance

## Component Tests

### `tests/components/congestion-badge.test.tsx`

Tests a congestion badge built on the existing `Badge` UI component with `getCongestionColor` styling.

## E2E Tests

### `tests/e2e/home.spec.ts`

- Verifies page title matches `APP_NAME`
- Checks navigation links are visible
- Tests navigation to `/features`

### `tests/e2e/accessibility.spec.ts`

- Runs axe-core accessibility scan (zero violations expected)
- Verifies `<main>` and `<nav>` landmarks exist

## Configuration

### Vitest (`vitest.config.ts`)

- Environment: `jsdom`
- Setup: `tests/setup.ts` (jest-dom matchers, Next.js navigation mock)
- Path alias: `@/` → `src/`
- Coverage excludes UI primitives and layouts

### Playwright (`playwright.config.ts`)

- Base URL: `http://localhost:3000`
- Auto-starts dev server via `npm run dev`
- Chromium only (extend with Firefox/WebKit as needed)
- Retries: 2 in CI, 0 locally

## Writing New Tests

### Unit test template

```typescript
import { describe, expect, it } from "vitest";
import { myFunction } from "@/lib/my-module";

describe("myFunction", () => {
  it("does the expected thing", () => {
    expect(myFunction("input")).toBe("output");
  });
});
```

### Component test template

```typescript
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MyComponent } from "@/components/my-component";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

### E2E test template

```typescript
import { test, expect } from "@playwright/test";

test("page loads", async ({ page }) => {
  await page.goto("/my-page");
  await expect(page.getByRole("heading")).toBeVisible();
});
```

## CI Integration

Recommended GitHub Actions workflow steps:

```yaml
- run: npm ci
- run: npm run typecheck
- run: npm run lint
- run: npm test
- run: npm run test:e2e
```

## Coverage Targets

| Area | Target |
|------|--------|
| `src/lib/` | 90%+ |
| `src/schemas/` | 90%+ |
| `src/services/` | 70%+ |
| API routes | 80%+ |

Run `npm run test:coverage` to generate the HTML report in `coverage/`.
