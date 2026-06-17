# Shoreline

Shoreline is an AI-powered activity booking app. Users browse coastal activities,
chat with a Gemini-backed assistant to ask questions and book slots, and review
their bookings history.

## Prerequisites

- Node.js 18+
- A Gemini API key (optional — app falls back to a rule-based parser without one)

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in GEMINI_API_KEY and APP_URL
npm run dev                  # http://localhost:3000
```

## Environment Variables

|Variable|Required|Description|
|---|---|---|
|`GEMINI_API_KEY`|No|Gemini API key. Falls back to rule-based chat if absent.|
|`APP_URL`|No|Hosted URL (used for self-referential links and OAuth callbacks).|

## API Endpoints

|Method|Path|Description|
|---|---|---|
|GET|`/api/health`|Liveness check|
|GET|`/api/activities`|List all activities|
|GET|`/api/activities/[id]`|Get a single activity|
|POST|`/api/chat`|AI chat — returns `{ reply, bookingAttempt }`|

## Testing

```bash
npm test                 # run all tests
npm run test:coverage    # with coverage report
```
