# Shoreline — Beach Activity Booking App

A Next.js 15 application for browsing and booking beach activities, featuring an AI-powered booking assistant built on Google Gemini.

## Features

- **Activity Listings** — browse surf, boat, and tour experiences with ratings, pricing, and availability
- **Activity Detail** — view specs, available slots, and group size limits
- **AI Booking Assistant** — conversational chat panel powered by Gemini 2.5 Flash; guides users through date/time/guest selection and issues a confirmation card when details are complete
- **Bookings Dashboard** — view and cancel confirmed reservations, persisted to `localStorage`
- **Fallback mode** — rule-based assistant kicks in automatically when `GEMINI_API_KEY` is absent or the API call fails

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5.8 |
| UI | React 19, Tailwind CSS v4, Lucide React icons, Motion |
| AI | Google Gemini 2.5 Flash (`@google/genai`) |
| Persistence | Browser `localStorage` |

## Project Structure

```text
src/
├── app/
│   ├── page.tsx                   # Listing page (home)
│   ├── activities/[id]/page.tsx   # Activity detail page
│   ├── bookings/page.tsx          # Bookings history page
│   └── api/
│       ├── health/route.ts        # GET /api/health
│       ├── activities/route.ts    # GET /api/activities
│       ├── activities/[id]/route.ts # GET /api/activities/:id
│       └── chat/route.ts          # POST /api/chat
├── components/
│   ├── ListingView.tsx
│   ├── DetailView.tsx
│   ├── BookingsView.tsx
│   ├── NavBar.tsx / Footer.tsx
│   ├── listing/               # ActivityCard, FilterBar, HeroSection, …
│   ├── detail/                # AIAssistantPanel, AvailabilitySlots, BookingConfirmCard, …
│   └── bookings/              # BookingCard, EmptyBookingsState
├── data/activities.ts         # Static activity catalogue
├── hooks/useBookings.ts       # localStorage-backed booking state
└── types.ts                   # Shared TypeScript interfaces
```

## API Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness check |
| `GET` | `/api/activities` | List all activities (no slot details) |
| `GET` | `/api/activities/:id` | Single activity with full slot data |
| `POST` | `/api/chat` | AI chat — accepts `{ messages, activityContext, systemTime }`, returns `{ reply, bookingAttempt }` |

### Chat response shape

```ts
{
  reply: string;           // assistant message to display
  bookingAttempt?: {       // present when slot + guest count are determined
    date: string;
    time: string;
    people: number;
    readyToConfirm: boolean;
  }
}
```

When `bookingAttempt.readyToConfirm` is `true`, the UI renders a confirmation card in the chat. Clicking it persists the booking.

## Getting Started

**Prerequisites:** Node.js 18+

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env.local
   ```

   Set `GEMINI_API_KEY` to your [Google AI Studio](https://aistudio.google.com) API key.
   The app runs without a key — the fallback assistant handles a basic date/time/people flow.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev      # Dev server with Turbopack hot reload
npm run build    # Production build
npm start        # Serve production build
npm run lint     # Next.js lint (ESLint + TypeScript)
```

## Key Types

```ts
Activity      // id, title, price, duration, availability, category, rating, slots[]
Booking       // confirmed reservation with date, time, peopleCount, totalPrice, status
ChatMessage   // sender ('user' | 'assistant'), text, timestamp
BookingAttempt // in-progress slot selection tracked by the AI assistant
```

## Data & State

- **Activity catalogue** is static, defined in `src/data/activities.ts`.
- **Bookings** are stored in `localStorage` under the key `shoreline_bookings_v1`. A seed booking (id `SL-0041`) is injected on first load.
- **AI chat history** is ephemeral — it lives in component state and is sent to `/api/chat` on every message for full-context replies.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | No | Google Gemini API key. Fallback assistant is used when absent. |
| `APP_URL` | No | Hosting URL — used for self-referential links and OAuth callbacks. |
