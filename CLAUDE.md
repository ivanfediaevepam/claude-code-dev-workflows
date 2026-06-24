# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Next.js dev server with Turbopack on port 3000
npm run build    # Build for production
npm start        # Serve production build
npm run lint     # Next.js ESLint check
```

## Environment Setup

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`. The app works without it — the chat API falls back to a rule-based assistant.

## Architecture

**Next.js 15 app router** — no separate server process. All routing is file-based under `src/app/`.

**API routes** (`src/app/api/`):
- `GET /api/health` — liveness check
- `GET /api/activities` — returns the full activity list
- `GET /api/activities/[id]` — returns a single activity
- `POST /api/chat` — sends conversation history + activity context to Gemini (`gemini-2.0-flash`), returns structured JSON with `reply` and optional `bookingAttempt`. Falls back to a rule-based parser when `GEMINI_API_KEY` is absent or the API call fails.

**Pages** (`src/app/`):

- `/` → `page.tsx` — activity listing (uses `ListingView`)
- `/activities/[id]` → `activities/[id]/page.tsx` — activity detail + AI chat panel (uses `DetailView`)
- `/bookings` → `bookings/page.tsx` — user's booking history (uses `BookingsView`)

**Components** (`src/components/`):

- Top-level view components: `ListingView`, `DetailView`, `BookingsView`
- Scoped sub-components under `listing/`, `detail/`, `bookings/`
- Shared layout: `NavBar`, `Footer`
- AI chat sub-components in `detail/`: `AIAssistantPanel`, `ChatMessageBubble`, `BookingConfirmCard`

**AI chat flow** (`AIAssistantPanel.tsx`): user messages POST to `/api/chat` with full conversation history and the current `Activity` as context. The response `{ reply, bookingAttempt }` drives the chat UI. When `bookingAttempt.readyToConfirm` is `true`, a `BookingConfirmCard` appears; confirming it persists the booking via the `useBookings` hook.

**Booking persistence** (`src/hooks/useBookings.ts`): custom hook wrapping `localStorage` under the key `shoreline_bookings_v1`.

**Key types** (`src/types.ts`): `Activity`, `Booking`, `ChatMessage`, `BookingAttempt`.

**Static data** (`src/data/activities.ts`): full list of `Activity` objects including slots, pricing, and availability.

**Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`). Primary green is `#00694c`.
