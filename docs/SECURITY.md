# Security Practices

## Input Validation

All API endpoints and server actions validate input with **Zod schemas** before processing. Invalid requests return `400` with structured error details:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": { ... }
  }
}
```

## Input Sanitization

User-provided text is sanitized before being sent to AI models:

| Function | Purpose |
|----------|---------|
| `escapeHtml()` | Prevents XSS in rendered output |
| `sanitizePromptInput()` | Strips control chars, role injection prefixes, and dangerous HTML tags |
| `sanitizeUrl()` | Validates URLs to http/https only |
| `stripHtml()` | Removes HTML tags from strings |
| `maskSensitive()` | Masks secrets in logs |

### Prompt Injection Prevention

`sanitizePromptInput` removes patterns like `system:`, `assistant:`, and `user:` prefixes that could hijack AI context, and strips `<script>`, `<iframe>`, and similar tags.

## Rate Limiting

API routes use an in-memory rate limiter (`checkRateLimit`) keyed by client IP:

- Default: 30 requests per minute per IP
- Configurable via `AI_RATE_LIMIT_PER_MINUTE`
- Returns `429 RATE_LIMITED` when exceeded

> **Production note:** Replace in-memory rate limiting with Redis or Vercel KV for multi-instance deployments.

## HTTP Security Headers

Configured in `next.config.ts` and `vercel.json`:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Restricts camera, allows microphone/geolocation for self |

## API Key Management

- `GEMINI_API_KEY` is server-only (never prefixed with `NEXT_PUBLIC_`)
- Firebase Admin credentials use server environment variables only
- Client Firebase config uses public env vars (safe by design with Firebase security rules)

## CSRF Protection

`CSRF_SECRET` is configured for future CSRF token validation on mutating server actions.

## Error Handling

- API routes catch unexpected errors and return generic `500 INTERNAL_ERROR` messages
- Detailed error information is logged server-side only (`console.error`)
- No stack traces or internal paths are exposed to clients

## Dependency Security

- Run `npm audit` regularly
- Keep Next.js and dependencies updated
- Use `.env.local` for secrets (gitignored)

## Incident Reporting

The `submitIncidentReport` server action validates severity levels and description length. Reports are currently mocked — production should:

1. Authenticate the reporter
2. Persist to Firestore with audit trail
3. Notify operations staff for `high` and `critical` severity

## Recommendations for Production

1. Enable Firebase Auth with role-based access control
2. Add Redis-backed rate limiting
3. Implement Content Security Policy (CSP) headers
4. Enable Vercel WAF or Cloudflare for DDoS protection
5. Rotate API keys periodically
6. Add request signing for organizer/volunteer endpoints
