# FIFA Stadium Intelligence AI

AI-powered digital command center for FIFA World Cup 2026 — helping fans, volunteers, and organizers navigate stadiums, predict crowd congestion, and respond to incidents in real time.

## Features

- **FIFA AI Assistant** — Multilingual chat for navigation, schedules, and FAQs
- **Crowd Prediction** — Real-time gate congestion and wait time predictions
- **Route Recommendation** — Optimal paths based on accessibility and crowd levels
- **Accessibility Assistant** — Voice-enabled guidance for all accessibility needs
- **Emergency AI** — Instant emergency guidance and evacuation routes
- **Sustainability Coach** — Track environmental impact at the venue
- **Volunteer & Organizer Tools** — Shift briefings, incident reporting, and operational intelligence

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI
- **AI:** Google Gemini (`@google/generative-ai`)
- **Validation:** Zod
- **Testing:** Vitest + Playwright + axe-core
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/your-org/stadiumiq-ai.git
cd stadiumiq-ai
npm install
cp .env.example .env.local
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_NAME` | No | Application display name |
| `NEXT_PUBLIC_APP_URL` | No | Public URL (default: `http://localhost:3000`) |
| `GEMINI_API_KEY` | No* | Google Gemini API key (*falls back to mock responses) |
| `AI_PROVIDER` | No | AI provider (`gemini`, default) |
| `AI_MODEL` | No | Gemini model (default: `gemini-2.0-flash`) |
| `AI_RATE_LIMIT_PER_MINUTE` | No | API rate limit per IP (default: 30) |
| `NEXT_PUBLIC_FIREBASE_*` | No | Firebase client config |
| `FIREBASE_ADMIN_*` | No | Firebase Admin SDK credentials |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Google Maps API key |
| `CSRF_SECRET` | No | CSRF token secret |

See [`.env.example`](.env.example) for the full list.

### Development

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run typecheck # TypeScript check
npm run lint      # ESLint
npm run format    # Prettier
```

## Architecture

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # REST API routes
│   │   ├── ai/           # Chat & generate endpoints
│   │   ├── crowd/        # Crowd predictions
│   │   ├── gates/        # Gate statuses
│   │   └── health/       # Health check
│   ├── actions/          # Server Actions
│   └── page.tsx          # Pages
├── components/           # React components
├── config/               # Environment configuration
├── constants/            # App constants
├── lib/                  # Utilities (sanitize, rate-limit, api-response)
├── schemas/              # Zod validation schemas
├── services/             # Business logic (AI, stadium data, Firebase)
├── styles/               # Global CSS
└── types/                # TypeScript types
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a detailed overview.

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/gates` | Current gate statuses |
| `GET` | `/api/crowd` | Crowd predictions |
| `POST` | `/api/ai/chat` | AI chat (validated, rate-limited) |
| `POST` | `/api/ai/generate` | Raw AI generation |

All API routes return JSON:

```json
{ "success": true, "data": { ... }, "timestamp": "..." }
```

```json
{ "success": false, "error": { "code": "...", "message": "..." } }
```

## Server Actions

- `sendChatMessage` — Validated AI chat via server action
- `submitIncidentReport` — Incident report submission with Zod validation

## Testing

```bash
npm test              # Unit & component tests (Vitest)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:e2e      # E2E tests (Playwright)
```

See [docs/TESTING.md](docs/TESTING.md) for the full testing guide.

## Security

Input sanitization, rate limiting, Zod validation, and security headers are built in. See [docs/SECURITY.md](docs/SECURITY.md).

## Accessibility

WCAG 2.1 AA compliance is validated via automated axe scans. See [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables from `.env.example`
4. Deploy

Configuration is in [`vercel.json`](vercel.json).

### Manual

```bash
npm run build
npm start
```

## License

Private — FIFA Stadium Intelligence AI © 2026
