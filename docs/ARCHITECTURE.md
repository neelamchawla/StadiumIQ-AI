# Architecture Overview

StadiumIQ-AI is a Next.js 15 App Router application for a FIFA World Cup 2026 **stadium intelligence** demo. It separates presentation, validated server entrypoints, AI services, and stadium decision data.

```
Client UI (persona pages)
   → sendChatMessage / submitIncidentReport / API routes
   → Zod validation + allowlisted context + rate limits
   → Stadium context builder + decision engine
   → Gemini (optional) or deterministic fallback
   → In-memory incident store (demo) / mock gate data
```

## Layers

### Presentation (`src/app/`, `src/features/`, `src/components/`)

- Persona-aware pages for fan, volunteer, and organizer demos
- Feature modules: chat, emergency, accessibility, gates, volunteer, organizer
- Demo role switcher in the header filters navigation

### Server entrypoints

| Path | Role |
|------|------|
| `src/app/actions/chat.ts` | Primary AI chat path used by the UI |
| `src/app/api/ai/chat/route.ts` | JSON chat API (same validation/context rules) |
| `src/app/api/ai/generate/route.ts` | Disabled (`410`) — no raw-prompt proxy |
| `src/app/actions/incident.ts` | Volunteer incident submit + organizer fetch |

### Decision services

| Service | Purpose |
|---------|---------|
| `services/ai/context.ts` | Allowlist client context; inject gates/weather/help centers |
| `services/ai/gemini.server.ts` | Gemini with systemInstruction + fallback |
| `services/stadium/data.ts` | Simulated live gate/crowd/weather data |
| `services/stadium/recommendations.ts` | Deterministic best-gate engine |
| `services/stadium/incidents.ts` | Volunteer → organizer demo store |

## AI Feature Flow

1. UI calls `askStadiumAI` → `sendChatMessage` (server action)
2. Request validated with `chatRequestSchema`
3. Rate limit checked per client IP
4. Context sanitized via allowlist; stadium snapshot attached
5. Gemini generates with feature system prompt, or fallback text is returned
6. UI renders the response (with live regions for assistive tech)

## Data Strategy

**Demo mode (default):** simulated MetLife Stadium gate/crowd data with mild time-based variation, plus process-local incident reports.

**Production seams (optional):** Firebase client config and Maps key are supported via env helpers (`isFirebaseConfigured`, `isMapsConfigured`) but are not required for evaluation.

## Deployment

Vercel serverless/Edge for pages and API routes. Security headers are defined in `next.config.ts`.
