# Security Practices

This document describes **controls that are actually implemented** in the demo, and what remains for production.

## Implemented Controls

### Input Validation

API routes and server actions validate input with **Zod schemas** before processing. Invalid requests return `400` with structured error details.

Chat context is **allowlisted** via `aiContextSchema` / `sanitizeAIContext` — free-form attacker JSON is not concatenated into prompts.

### Prompt Handling

- User messages are sanitized with `sanitizePromptInput` (length cap, control chars, role-prefix stripping).
- Gemini calls use `systemInstruction` + user content (`gemini.server.ts`), not a single concatenated attacker-controlled prompt.
- Public raw-prompt endpoint `POST /api/ai/generate` is **disabled** (`410 ENDPOINT_REMOVED`).
- Clients must use `sendChatMessage` or `POST /api/ai/chat`.

### Rate Limiting

AI chat and incident submission use an in-memory rate limiter keyed by client IP:

- Default: 30 chat requests / minute (`AI_RATE_LIMIT_PER_MINUTE`)
- Incident reports: capped lower
- IP sourcing prefers `x-real-ip` / `x-vercel-forwarded-for` over the first `X-Forwarded-For` hop

> **Production note:** Replace in-memory limiting with Redis or Vercel KV for multi-instance deployments.

### HTTP Security Headers

Configured in `next.config.ts` (and mirrored partially in `vercel.json`):

| Header | Purpose |
|--------|---------|
| `Content-Security-Policy` | Restricts script/style/connect sources |
| `Strict-Transport-Security` | Enforces HTTPS on supporting hosts |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Camera off; mic/geo self |

### API Key Management

- `GEMINI_API_KEY` is server-only (never `NEXT_PUBLIC_`)
- UI never talks to Gemini directly — only via server action / chat API
- Health endpoint does **not** disclose whether secrets are configured

### Error Handling

- Unexpected errors return generic `500 INTERNAL_ERROR`
- Details are logged server-side only

### Incident Reporting

`submitIncidentReport` validates input, sanitizes fields, rate-limits, and stores reports in a process-local store for the volunteer → organizer demo loop. Production should authenticate reporters and persist to Firestore with an audit trail.

## Demo Auth (Honest Scope)

Demo auth is **localStorage-based role switching** for judges (fan / volunteer / organizer). It is **not** production authentication.

- Do not treat demo roles as authorization for sensitive operations
- Production should use Firebase Auth (or equivalent) + server-side token verification + middleware RBAC

## Not Claimed / Not Implemented

| Topic | Status |
|-------|--------|
| CSRF token secret | Removed — rely on SameSite cookies + Next.js server action origin checks; add explicit CSRF if exposing cookie-auth mutations cross-site |
| Firebase Admin SDK | Not bundled until Admin features exist |
| Redis rate limits | Documented upgrade path only |
| Production RBAC | Demo role switcher only |

## Recommendations for Production

1. Enable Firebase Auth with verified ID tokens on server actions/API
2. Add Redis/KV rate limiting and WAF
3. Persist incidents with audit trail
4. Rotate API keys periodically
5. Run `npm audit` in CI and keep Next.js patched
