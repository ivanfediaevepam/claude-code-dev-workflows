# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server with Turbopack on port 3000
npm run build        # Build for production
npm start            # Serve production build
npm run lint         # Next.js ESLint check
npm test             # Run Jest test suite
npm run test:watch   # Jest in watch mode
npm run test:coverage # Jest with coverage report
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:
- `GEMINI_API_KEY` — required for AI chat. Falls back to rule-based parser if absent.
- `APP_URL` — the URL where the app is hosted (used for self-referential links).

## Architecture

**Framework:** Next.js 15 App Router (TypeScript). No separate Express server.

**API routes** (under `src/app/api/`):
- `GET  /api/health` — liveness check
- `GET  /api/activities` — returns full activity list
- `GET  /api/activities/[id]` — returns a single activity by id
- `POST /api/chat` — sends conversation history + activity context to Gemini (`gemini-2.5-flash`), returns `{ reply, bookingAttempt }`. Falls back to a rule-based parser when `GEMINI_API_KEY` is absent or the API call fails.

**Frontend** is a Next.js App Router SPA. Screens are file-system routed under `src/app/`.

**AI chat flow:** user messages are sent to `/api/chat` with the full conversation history and the current `Activity` object as context. The server's Gemini response (or fallback) returns `{ reply, bookingAttempt }`. When `bookingAttempt.readyToConfirm` is `true`, a confirmation panel appears in the chat.

**Key types** (`src/types.ts`): `Activity`, `Booking`, `ChatMessage`, `BookingAttempt`.

**Static data** lives in `src/data/activities.ts` — the full list of `Activity` objects including slots, pricing, and availability.

**Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin). Primary green `#00694c`.
