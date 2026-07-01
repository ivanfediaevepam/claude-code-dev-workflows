# CAMC Sprint 1 — Shoreline Booking App

## Activity Catalogue & Filtering

### CAMC-9 · Activity Catalogue with Cards · ✅ Done

**Story:** As a user, I want to see all available beach activities in a convenient view so that I can quickly find and choose the right one.

Each `ActivityCard` displays: activity photo, category (Surf/Boat/Tours), rating and review count, price per person, duration, and availability status — `Available` (green) / `Limited` (yellow) / `Full` (grey). Data is fetched via `GET /api/activities`. Requests are wrapped in `AbortController`.

**AC:**

- Cards displayed in 1/2/3 column responsive grid (mobile/tablet/desktop)
- Skeleton animation shown during loading
- Network error shows error message + Retry button
- Clicking a card opens the activity detail page
- Activities with `Full` status do not allow initiating a booking

---

### CAMC-10 · Activity Filtering by Category and Date · ✅ Done

**Story:** As a user, I want to filter activities by type and date so that I only see options that fit my schedule.

`FilterBar` provides category pills (`All` / `Surf` / `Boat` / `Tours`) and a native date picker (`<input type="date">`). Date is passed as ISO string (`?date=2026-06-12`); server converts to `"June 12"` format and matches non-full slots. Previous requests cancelled via `AbortController` on filter change.

**AC:**

- Selecting a category immediately updates the list without a page reload
- Selecting a date returns only activities with available slots on that date
- Active filter visually highlighted; Clear button works correctly
- With `category=All` and no date, all activities returned

---

## Activity Detail

### CAMC-11 · Activity Detail Page · ✅ Done

**Story:** As a user, I want to see full information about an activity so that I can make an informed booking decision.

Two-column layout (7:5 CSS Grid). Left: cover image, tags, title, description, specs, availability slots. Right: AI Booking Assistant panel (sticky `lg:sticky lg:top-24`).

**AC:**

- Layout renders correctly on desktop (7:5) and stacks vertically on mobile
- AI panel stays visible on scroll
- Rating and review count displayed in a badge overlaid on the cover image
- Like button toggles between states with animation
- Back button correctly navigates to listing view

---

### CAMC-12 · Availability Slots with One-Click Booking · ✅ Done

**Story:** As a user, I want to click on a time slot to instantly start the booking flow without typing anything manually.

`AvailabilitySlots` shows date, time range, `spotsLeft`, and a visual indicator for full slots. Clicking an available slot calls `onSlotClick({ date, time })`, which auto-composes the message `"I'd like to book for June 12 at 10:00 AM - 12:00 PM"` and sends it to the AI chat.

**AC:**

- Available slots display the number of spots remaining
- Full slots (`full: true`) are visually inactive and non-clickable
- Clicking a slot automatically composes a message in the AI chat
- Message is correctly parsed by the assistant and initiates the dialogue

---

## AI Booking Assistant

### CAMC-13 · AI Booking Assistant (Gemini 2.5 Flash) · ✅ Done

**Story:** As a user, I want to chat with an AI assistant in natural language so that it helps me choose and book an activity without filling in forms.

`POST /api/chat` accepts `{ messages, activityContext, systemTime }`. Sends full conversation history to `gemini-2.5-flash` with `responseMimeType: "application/json"`. Response shape:

```json
{
  "reply": "string",
  "bookingAttempt": {
    "date": "June 12",
    "time": "10:00 AM - 12:00 PM",
    "people": 2,
    "readyToConfirm": true
  }
}
```

Assistant only suggests slots from the provided list, validates `peopleCount ≤ maxGroupSize`, and sets `readyToConfirm: true` only when a valid slot AND valid guest count are confirmed.

**AC:**

- Assistant responds in the context of the specific activity
- Selecting a full slot results in the assistant suggesting an alternative
- `bookingAttempt` appears only when all booking details are collected
- Typing indicator shown while waiting for a response
- Chat automatically scrolls to the latest message

---

### CAMC-14 · Fallback Assistant (Works Without API Key) · ✅ Done

**Story:** As a developer, I want the application to work without a `GEMINI_API_KEY` so that I can demo it in any environment.

Two-level fallback:

- **Level 1 (server):** activated when key is absent or Gemini call fails; rule-based parser on the last user message (`"JUNE 12" + "10"/"TEN"` → `readyToConfirm: true`, numbers 1–6 → records guest count, etc.)
- **Level 2 (client):** activated on fetch network error in `DetailView.tsx`; identical logic, 1 s simulated delay, console log `"AI Assistant service call error, using local fallback parser"`

**AC:**

- App works fully without `GEMINI_API_KEY`
- Server-side fallback logs a warning on initialisation and activation
- Client-side fallback triggers on network error with a 1 s delay
- Both fallbacks produce a `bookingAttempt` and lead to booking confirmation

---

### CAMC-15 · Booking Confirmation Card in Chat · 🔲 To Do · Assignee: Ivan Fediaev

**Story:** As a user, I want to see a summary card with booking details inline in the chat and confirm the reservation with a single click.

When `readyToConfirm: true`, `BookingConfirmCard` appears in the chat stream showing activity name, date/time, guest count, and total price (`price × people`). Clicking **Confirm Booking** runs `executeConfirmBooking`:

1. Creates a `Booking` with `id: SL-{random 4-digit}`, `status: "Confirmed"`, and activity-specific `preparationGuide`
2. Calls `onAddBooking(newBooking)` → saved to `localStorage`
3. Resets `bookingAttempt` to `null` → card disappears
4. Adds congratulatory message: `🎉 Congratulations! Your reservation... Booking ID SL-XXXX`

**AC:**

- Card appears only when `readyToConfirm === true`
- Total price calculated correctly (`price × people`)
- After confirmation, card disappears and a congratulatory message with Booking ID appears
- Booking immediately appears in the Dashboard
- `preparationGuide` correctly set based on activity type

---

## Bookings Dashboard

### CAMC-16 · Bookings Management Dashboard · 🔲 To Do · Assignee: Ivan Fediaev

**Story:** As a user, I want to see all my bookings in one place and be able to cancel them.

`BookingCard` shows: activity image + "Confirmed" badge, name, Booking ID (monospace), date/time, guest count, preparation guide, total price, and action buttons. Two-step cancellation: click "Cancel" → inline confirmation panel → ✓ confirm or ✗ abort. Exit animation via `AnimatePresence` (`exit={{ opacity: 0, scale: 0.95 }}`).

**AC:**

- Only `Confirmed` bookings displayed
- Cancellation requires two-step confirmation
- Exit animation fires correctly on cancellation
- "View Details" opens the detail page for the corresponding activity
- When list is empty, `EmptyBookingsState` shown with an "Explore" button

---

### CAMC-17 · Booking Persistence via localStorage · 🔲 To Do · Assignee: Ivan Fediaev

**Story:** As a user, I want my bookings to persist after a page reload without needing to register.

`useBookings` hook, storage key `shoreline_bookings_v1`. On first launch seeds booking SL-0041 (Beginner Surf Lesson, June 12, 2 guests, €90). `JSON.parse` wrapped in `try/catch` → corrupted data falls back to seed booking.

Hook API: `bookings`, `addBooking` (prepends), `cancelBooking` (sets `Cancelled`, no delete), `saveBookings` (full overwrite).

**AC:**

- Bookings persist between page reloads
- Seed booking SL-0041 created on first launch
- Corrupted `localStorage` JSON triggers graceful fallback to seed booking
- `addBooking` prepends new booking to top of list
- `cancelBooking` changes status without deleting the record

---

## REST API

### CAMC-18 · REST API for Activities and Health Check · 🔲 To Do · Assignee: Ivan Fediaev

**Story:** As a developer, I want a standard REST API for activities so that the frontend can fetch data asynchronously.

Three Next.js App Router route handlers:

- `GET /api/health` → `200 OK`
- `GET /api/activities` → `{ data: ActivitySummary[], total: number }` (params: `?category`, `?date`)
- `GET /api/activities/:id` → full `Activity` with slots; `404` if not found

Date filtering: ISO string → `new Date()` → `"June 12"` format → matches activities with a non-full slot on that date. Types strictly follow `src/types.ts`.

**AC:**

- `GET /api/health` returns `200 OK`
- `GET /api/activities` without params returns all 5 activities
- `GET /api/activities?category=Surf` returns only Surf activities
- `GET /api/activities?date=2026-06-12` returns activities with available slots on that date
- `GET /api/activities/beginner-surf` returns full data including slots
- `GET /api/activities/unknown-id` returns `404`

---

### CAMC-24 · Harden `POST /api/chat` (Input Validation & Rate Limiting)

| Field | Value |
| --- | --- |
| **Type** | Technical Debt / Non-Functional |
| **Priority** | High |
| **Status** | 🔲 To Do |
| **Assignee** | Ivan Fediaev |
| **Sprint** | CAMC Sprint 1 |
| **Labels** | `api` · `security` · `hardening` · `nfr` |

---

**User Story**

As an operator of the Shoreline app, I want the `POST /api/chat` endpoint to reject malformed payloads and throttle abusive clients, so that the Gemini API quota and the server are not exhausted by buggy or hostile callers.

**Background / Context**

`POST /api/chat` currently accepts a request body (`{ messages, activityContext, systemTime }`), forwards it to Gemini, and falls back to the rule-based parser when `GEMINI_API_KEY` is absent or the Gemini call fails (CAMC-13, CAMC-14). Today the handler trusts the request body as-is and applies no rate limiting. A malformed payload or a rapid burst of requests can trigger runtime errors or burn through the Gemini quota. This ticket hardens the endpoint without changing its happy-path behaviour or the UI.

**Acceptance Criteria**

- [ ] **AC1 — Happy path unchanged.** A well-formed request (`{ messages, activityContext, systemTime }`) returns the same `{ reply, bookingAttempt }` response as today.
- [ ] **AC2 — Malformed body rejected.** A body that is not valid JSON, is missing `messages`, has `messages` that is not an array, or contains a message missing required fields returns **400** with a consistent `{ error: { code, message } }` body.
- [ ] **AC3 — Oversized input rejected.** A request exceeding the message-count limit, or containing a message whose text exceeds the per-message character limit, is rejected with a clear error. *(Limits: see Open Questions.)*
- [ ] **AC4 — Rate limiting.** A client exceeding the allowed request rate receives **429** with a `Retry-After` header. *(Threshold/window: see Open Questions.)*
- [ ] **AC5 — Per-client isolation.** Rate-limit state is tracked per client and never leaks across clients; one client hitting the limit does not throttle another.
- [ ] **AC6 — Safe, uniform errors.** All error responses share the same `{ error: { code, message } }` shape and never expose stack traces or internal details.
- [ ] **AC7 — Fallback preserved.** Existing fallback behaviour (no `GEMINI_API_KEY`, or Gemini failure) continues to work unchanged and is subject to the same protections.
- [ ] **AC8 — No UI change, no new dependency.** No change to any client component; no new npm dependency unless explicitly justified.
