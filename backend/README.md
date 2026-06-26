# Diagno Backend — Next.js API

Next.js 15 App Router used as a pure API backend (no pages/UI).
Frontend (Vite + React) runs separately on port 5173.

## Structure

```
backend/
├── src/
│   ├── app/api/          # Route handlers (Next.js App Router)
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   └── me/route.js
│   │   ├── analysis/
│   │   │   ├── route.js          # GET list / POST create
│   │   │   └── [id]/route.js     # GET single
│   │   └── patient/route.js
│   ├── lib/
│   │   ├── auth.js       # JWT sign/verify helpers
│   │   └── response.js   # ok/error/unauthorized helpers
│   └── modules/
│       └── ai/
│           └── ai.service.js     # Swap-ready LLM abstraction
├── .env.example
├── next.config.js
└── package.json
```

## Setup

```bash
cd backend
npm install
cp .env.example .env.local
# Fill in JWT_SECRET and API keys in .env.local
npm run dev   # starts on http://localhost:4000
```

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user |
| GET | /api/analysis | Yes | List analyses |
| POST | /api/analysis | Yes | Create analysis |
| GET | /api/analysis/:id | Yes | Get single analysis |
| GET | /api/patient | Yes | List patients |
| POST | /api/patient | Yes | Create patient |

## AI Provider

Set `AI_PROVIDER` in `.env.local`:
- `openai` — uses OpenAI API (default, requires `OPENAI_API_KEY`)
- `anthropic` — uses Anthropic Claude (requires `ANTHROPIC_API_KEY`)

To add a new provider, extend `src/modules/ai/ai.service.js`.

## Connecting the Frontend

In frontend `src/shared/api/client.js`, set `baseURL` to `http://localhost:4000`.
