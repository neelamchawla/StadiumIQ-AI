# Architecture Overview

## System Design

FIFA Stadium Intelligence AI is a Next.js 15 application using the App Router with a layered architecture separating presentation, API, business logic, and data access.

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  React Components · Server Actions · Fetch API           │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   Next.js App Router                     │
│  Pages · Layouts · API Routes · Server Actions             │
└──────────┬───────────────────────────────┬────────────────┘
           │                               │
┌──────────▼──────────┐         ┌──────────▼──────────────┐
│   Validation Layer   │         │    Security Layer        │
│   Zod Schemas        │         │  Rate Limit · Sanitize   │
└──────────┬──────────┘         └──────────┬──────────────┘
           │                               │
┌──────────▼───────────────────────────────▼──────────────┐
│                    Service Layer                         │
│  AI Provider · Gemini Server · Stadium Data              │
└──────────┬───────────────────────────────┬──────────────┘
           │                               │
┌──────────▼──────────┐         ┌──────────▼──────────────┐
│   Google Gemini API  │         │  Firebase / Mock Data    │
└─────────────────────┘         └─────────────────────────┘
```

## Layers

### Presentation (`src/app/`, `src/components/`)

- **Pages** render UI with server and client components
- **Server Actions** (`src/app/actions/`) handle form submissions and mutations without exposing API endpoints
- **API Routes** (`src/app/api/`) serve JSON for client-side fetch and external integrations

### Validation (`src/schemas/`)

All user input is validated with Zod schemas before processing:

- `chatRequestSchema` — AI chat messages
- `incidentReportSchema` — Incident reports
- Additional schemas for routes, emergencies, and profiles

### Security (`src/lib/`)

- `sanitize.ts` — HTML escaping and prompt injection prevention
- `rate-limit.ts` — In-memory per-IP rate limiting
- `api-response.ts` — Typed success/error JSON responses

### Services (`src/services/`)

| Service | Purpose |
|---------|---------|
| `ai/gemini.server.ts` | Server-side Gemini API calls |
| `ai/provider.ts` | AI provider abstraction with mock fallback |
| `ai/prompts.ts` | System prompts per AI feature |
| `stadium/data.ts` | Gate status, crowd predictions, incidents (mock) |
| `firebase/client.ts` | Firebase client initialization |

### Configuration (`src/config/`)

Centralized environment config with helper functions:

- `isAIConfigured()` — Check if Gemini API key is set
- `isFirebaseConfigured()` — Check Firebase client config
- `isMapsConfigured()` — Check Google Maps API key

## AI Feature Flow

1. User sends a message via chat UI or API
2. Request validated against `chatRequestSchema`
3. Rate limit checked per client IP
4. Message sanitized via `sanitizePromptInput`
5. System prompt selected based on `feature` type
6. `generateWithGemini` calls Google Gemini (or returns fallback)
7. Response returned with confidence score

## Data Strategy

Currently uses mock data in `src/services/stadium/data.ts` and `src/constants/`. Production deployment should replace these with:

- **Firestore** for real-time gate status and incidents
- **Cloud Functions** for crowd prediction aggregation
- **Firebase Auth** for user sessions and role-based access

## Deployment Architecture

```
Vercel Edge Network
├── Static assets (public/)
├── Serverless Functions (API routes, server actions)
└── ISR/SSR pages
```

Security headers are configured in both `next.config.ts` and `vercel.json`.

## Key Design Decisions

1. **Graceful AI degradation** — Mock responses when Gemini is unavailable
2. **Server-side AI calls** — API keys never exposed to the client
3. **Typed API responses** — Consistent `{ success, data | error }` envelope
4. **Feature-based prompts** — Each AI capability has a dedicated system prompt
