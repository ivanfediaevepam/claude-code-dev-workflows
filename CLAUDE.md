# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Express + Vite middleware) on port 3000
npm run build    # Build frontend with Vite + bundle server.ts with esbuild
npm start        # Serve production build from dist/
npm run lint     # TypeScript type check (tsc --noEmit) — no ESLint
npm run clean    # Remove dist/ and server.js
```

## Environment Setup

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`. The app works without it — the server falls back to a rule-based chat assistant.

## Architecture

**Single server entry point** — `server.ts` runs Express and serves both the API and the React SPA. In dev mode it mounts Vite as an Express middleware (no separate Vite process). In production it serves static files from `dist/`.

**API routes** (all in `server.ts`):
- `GET /api/health` — liveness check
- `POST /api/chat` — sends conversation history + activity context to Gemini (`gemini-3.5-flash`), returns structured JSON with `reply` and optional `bookingAttempt`. Falls back to a rule-based parser when `GEMINI_API_KEY` is absent or the API call fails.

**Frontend** is a React 19 SPA with three screens managed by `App.tsx`:
- `listing` → `ListingView` — activity cards grid
- `detail` → `DetailView` — activity info + AI chat panel (right column)
- `bookings` → `BookingsView` — user's booking history

Screen routing is local state in `App.tsx`; no router library is used. Booking state persists to `localStorage` under the key `shoreline_bookings_v1`.

**AI chat flow** (`DetailView.tsx`): user messages are sent to `/api/chat` with the full conversation history and the current `Activity` object as context. The server's Gemini response (or fallback) returns `{ reply, bookingAttempt }`. When `bookingAttempt.readyToConfirm` is `true`, a confirmation panel appears in the chat; clicking it calls `onAddBooking` back in `App.tsx`.

**Key types** (`src/types.ts`): `Activity`, `Booking`, `ChatMessage`, `BookingAttempt` — all interfaces used across both the frontend and the server's request/response contract.

**Static data** lives in `src/data/activities.ts` — the full list of `Activity` objects including slots, pricing, and availability.

**Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin). Colors are hardcoded hex values (primary green `#00694c`) rather than Tailwind config tokens, except for a few semantic tokens like `text-primary`, `text-outline`, `text-on-surface` used in JSX.