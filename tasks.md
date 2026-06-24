# Shoreline — Jira Tasks for Demo

## Project Context

**Shoreline** is a web application for browsing and booking beach activities (Next.js 15 + React 19 + Tailwind CSS v4 + Google Gemini 2.5 Flash).

### Problem We Are Solving

The beach and tourist activity market suffers from a **high booking friction**: users are forced to scroll through dozens of cards, manually cross-reference dates, time slots, availability, and pricing. Traditional booking forms create cognitive overload and lead to abandoned sessions.

**Shoreline solves this through three core principles:**
1. **Conversational booking** — a Gemini 2.5 Flash–powered AI assistant guides users through the booking process in natural language, eliminating complex forms entirely.
2. **Contextual awareness** — the assistant knows the specific activity, its available slots, capacity, and pricing, so it never suggests unavailable options.
3. **Registration-free booking** — reservations are persisted instantly in the browser (`localStorage`), lowering the barrier to a first booking.

---

## Tasks (Implemented Features)

---

### TASK-01 · Activity Catalogue with Cards

**Type:** Story  
**Priority:** High  
**Components:**
- [`src/components/ListingView.tsx`](src/components/ListingView.tsx)
- [`src/components/listing/ActivityCard.tsx`](src/components/listing/ActivityCard.tsx)
- [`src/components/listing/HeroSection.tsx`](src/components/listing/HeroSection.tsx)
- [`src/components/listing/EmptyActivitiesState.tsx`](src/components/listing/EmptyActivitiesState.tsx)

**User Story:**  
> As a user, I want to see all available beach activities in a convenient view so that I can quickly find and choose the right one.

**Description:**  
The home screen of the application is implemented as a responsive activity card grid. Each `ActivityCard` displays:
- Activity photo
- Category (Surf / Boat / Tours)
- Rating and review count
- Price per person
- Duration
- Availability status — `Available` (green) / `Limited` (yellow) / `Full` (grey)

Data is fetched via REST API (`GET /api/activities`). Three loading states are handled:
- **Loading** — skeleton animation using 6 placeholder cards with `animate-pulse`
- **Error** — error message + `Retry` button for re-fetching
- **Empty** — `EmptyActivitiesState` component with a call-to-action

**Technical Details:**  
Each fetch is wrapped in an `AbortController` to cancel in-flight requests on component unmount. Filter state (`selectedCategory`, `filterDate`) is stored locally via `useState` and passed as props to `FilterBar`.

**Acceptance Criteria:**
- [ ] Cards are displayed in a 1/2/3 column responsive grid (mobile/tablet/desktop)
- [ ] Skeleton animation is shown during loading
- [ ] On network error, an error message with a Retry button is displayed
- [ ] Clicking a card opens the activity detail page
- [ ] Activities with `Full` status do not allow initiating a booking

---

### TASK-02 · Activity Filtering by Category and Date

**Type:** Story  
**Priority:** High  
**Components:**
- [`src/components/listing/FilterBar.tsx`](src/components/listing/FilterBar.tsx)
- [`src/app/api/activities/route.ts`](src/app/api/activities/route.ts)

**User Story:**  
> As a user, I want to filter activities by type and date so that I only see options that fit my schedule.

**Description:**  
The `FilterBar` component is implemented with two filtering mechanisms:

**1. Category Pills:**  
Four pill buttons: `All` / `Surf` / `Boat` / `Tours`. The active category is highlighted with a filled background (`#00694c`). Changing the category immediately triggers a new API request.

**2. Date Picker:**  
A native `<input type="date">` with a calendar icon. When a date is selected, it is passed to the API as an ISO string (`?date=2026-06-12`). A `Clear` button appears inside the field on the right when a date is selected.

**Server-side Filtering Logic (`route.ts`):**
- By category: exact match on the `category` field
- By date: ISO string is parsed → converted to `"June 12"` format → activities are matched by checking if they have at least one non-full (`full: false`) slot on that date

**Acceptance Criteria:**
- [ ] Selecting a category immediately updates the list without a page reload
- [ ] Selecting a date returns only activities with available slots on that date
- [ ] Previous requests are cancelled via `AbortController` when a filter changes
- [ ] The active filter is visually highlighted; the Clear button works correctly
- [ ] With `category=All` and no date, all activities are returned

---

### TASK-03 · Activity Detail Page

**Type:** Story  
**Priority:** High  
**Components:**
- [`src/components/DetailView.tsx`](src/components/DetailView.tsx)
- [`src/components/detail/ActivitySpecs.tsx`](src/components/detail/ActivitySpecs.tsx)
- [`src/app/activities/[id]/page.tsx`](src/app/activities/[id]/page.tsx)

**User Story:**  
> As a user, I want to see full information about an activity so that I can make an informed booking decision.

**Description:**  
The activity detail page is implemented with a two-column layout (7:5 ratio via CSS Grid).

**Left Column (7/12):**
- Cover image at `4/3` aspect ratio with an overlay rating badge (star + score + review count)
- Activity tags as pills (`Water Sports`, `Beginner Friendly`, etc.)
- Title and full description
- Activity specs (`ActivitySpecs`): duration, price per person, max group size
- Availability slot list (`AvailabilitySlots`)

**Right Column (5/12):**
- AI Booking Assistant panel (`AIAssistantPanel`) — sticky on scroll

**Navigation:**
- `← Back to activities` button returns to the listing screen
- Like button (Heart icon) — toggle with visual animation (red heart when active)

**Acceptance Criteria:**
- [ ] Layout renders correctly on desktop (7:5) and stacks vertically on mobile
- [ ] AI panel stays visible on scroll (`lg:sticky lg:top-24`)
- [ ] Rating and review count are displayed in a badge overlaid on the cover image
- [ ] Like button toggles between states with animation
- [ ] Back button correctly navigates to the listing view

---

### TASK-04 · Availability Slots with One-Click Booking

**Type:** Story  
**Priority:** Medium  
**Components:**
- [`src/components/detail/AvailabilitySlots.tsx`](src/components/detail/AvailabilitySlots.tsx)

**User Story:**  
> As a user, I want to click on a time slot to instantly start the booking flow without typing anything manually.

**Description:**  
The `AvailabilitySlots` component displays all time slots for an activity with the following information:
- Slot date
- Time range (start–end)
- Number of spots remaining (`spotsLeft`)
- Visual indicator: `full: true` → slot is displayed in grey with "Full" text and is not clickable

**One-click Booking Mechanism:**  
Clicking an available slot calls `onSlotClick({ date, time })`. In `DetailView`, this is translated into a user message sent to the AI chat:  
`"I'd like to book for June 12 at 10:00 AM - 12:00 PM"` — immediately starting the booking dialogue in `AIAssistantPanel` without any manual input.

**Acceptance Criteria:**
- [ ] Available slots display the number of spots remaining
- [ ] Full slots (`full: true`) are visually inactive and non-clickable
- [ ] Clicking a slot automatically composes a message in the AI chat
- [ ] The message is correctly parsed by the assistant and initiates the dialogue

---

### TASK-05 · AI Booking Assistant (Gemini 2.5 Flash)

**Type:** Story  
**Priority:** Critical  
**Components:**
- [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts)
- [`src/components/detail/AIAssistantPanel.tsx`](src/components/detail/AIAssistantPanel.tsx)
- [`src/components/detail/ChatMessageBubble.tsx`](src/components/detail/ChatMessageBubble.tsx)

**User Story:**  
> As a user, I want to chat with an AI assistant in natural language so that it helps me choose and book an activity without filling in forms.

**Description:**  
The core feature of the product — conversational booking via `POST /api/chat`.

**How the API route works:**
1. Accepts `{ messages, activityContext, systemTime }` in the request body
2. Validates the payload (returns 400 on invalid data)
3. Lazily initialises the Gemini client per-request via `createAiClient()`
4. Builds a `systemInstruction` containing the activity context: price, duration, capacity, and the full slot list with "FULL" markers for unavailable slots
5. Sends the full conversation history to `gemini-2.5-flash` with `responseMimeType: "application/json"` and a `responseSchema`

**Gemini Response Shape (enforced via responseSchema):**
```json
{
  "reply": "string — a friendly message for the guest",
  "bookingAttempt": {
    "date": "June 12",
    "time": "10:00 AM - 12:00 PM",
    "people": 2,
    "readyToConfirm": true
  }
}
```

**Assistant Logic (from systemInstruction):**
- Only suggests slots from the provided list
- If a full slot is selected → suggests an alternative
- Validates that `peopleCount ≤ maxGroupSize`
- Sets `readyToConfirm: true` only when **both** a valid slot **and** a valid guest count are confirmed

**UI (`AIAssistantPanel`):**
- Fixed-height panel (`h-[600px]`) with a scrollable chat area
- "Online" indicator in the header
- Typing indicator (`Loader2` with `animate-spin` + "Tuning availability..." text)
- Auto-scroll to the last message via `scrollIntoView`
- Input field with placeholder hint and a Send button (disabled when empty or while `isTyping`)

**Acceptance Criteria:**
- [ ] The assistant responds in the context of the specific activity
- [ ] Selecting a full slot results in the assistant suggesting an alternative
- [ ] `bookingAttempt` appears only when all booking details are collected
- [ ] The typing indicator is shown while waiting for a response
- [ ] The chat automatically scrolls to the latest message

---

### TASK-06 · Fallback Assistant (Works Without API Key)

**Type:** Story  
**Priority:** Medium  
**Components:**
- [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) (lines 140–201)
- [`src/components/DetailView.tsx`](src/components/DetailView.tsx) (lines 88–141)

**User Story:**  
> As a developer, I want the application to work without a `GEMINI_API_KEY` so that I can demo it in any environment.

**Description:**  
A two-level fallback is implemented to guarantee booking functionality with no external dependencies:

**Level 1 — Server-side Fallback (`route.ts`):**  
Activated when `GEMINI_API_KEY` is absent or the Gemini API call fails. A rule-based parser analyses the last user message (`inputUpper`):
- `"JUNE 12" + "10"/"TEN"` → ready booking for June 12, 10:00 AM with `readyToConfirm: true`
- `"JUNE 13" + "10"/"TEN"` → same for June 13
- Numbers 1–6 → records guest count, asks for date
- Otherwise → generic response listing available slots

**Level 2 — Client-side Fallback (`DetailView.tsx`):**  
Activated on a `fetch` network error. Local parser with identical logic. Simulates a response delay via `setTimeout(..., 1000)` for a realistic UX. Logs to console: `"AI Assistant service call error, using local fallback parser"`.

**Acceptance Criteria:**
- [ ] The application works fully without `GEMINI_API_KEY`
- [ ] The server-side fallback logs a warning on initialisation and activation
- [ ] The client-side fallback triggers on network error with a 1-second delay
- [ ] Both fallbacks correctly produce a `bookingAttempt` and lead to booking confirmation

---

### TASK-07 · Booking Confirmation Card in Chat

**Type:** Story  
**Priority:** High  
**Components:**
- [`src/components/detail/BookingConfirmCard.tsx`](src/components/detail/BookingConfirmCard.tsx)
- [`src/components/DetailView.tsx`](src/components/DetailView.tsx) (`executeConfirmBooking` function)

**User Story:**  
> As a user, I want to see a summary card with booking details inline in the chat and confirm the reservation with a single click.

**Description:**  
When the AI assistant collects all necessary details and sets `readyToConfirm: true`, a `BookingConfirmCard` component appears in the chat message stream.

**Card Contents:**
- Activity name
- Booking date and time
- Number of guests
- Total price (`price × people`)
- **"Confirm Booking"** button

**Confirmation Flow (`executeConfirmBooking`):**
1. A `Booking` object is created:
   - `id`: `SL-{random 4-digit}`
   - All activity fields are copied
   - `status: "Confirmed"`
   - `preparationGuide`: activity-specific (custom text for `beginner-surf`, generic for others)
2. `onAddBooking(newBooking)` is called → booking is added to `localStorage`
3. `bookingAttempt` is reset to `null` → the card disappears
4. A congratulatory message is sent to the chat: `🎉 Congratulations! Your reservation... Booking ID SL-XXXX`

**Acceptance Criteria:**
- [ ] The card appears only when `readyToConfirm === true`
- [ ] Total price is calculated correctly (`price × people`)
- [ ] After confirmation, the card disappears and a congratulatory message with Booking ID appears in the chat
- [ ] The booking immediately appears in the Dashboard
- [ ] `preparationGuide` is correctly set based on activity type

---

### TASK-08 · Bookings Management Dashboard

**Type:** Story  
**Priority:** High  
**Components:**
- [`src/components/BookingsView.tsx`](src/components/BookingsView.tsx)
- [`src/components/bookings/BookingCard.tsx`](src/components/bookings/BookingCard.tsx)
- [`src/components/bookings/EmptyBookingsState.tsx`](src/components/bookings/EmptyBookingsState.tsx)

**User Story:**  
> As a user, I want to see all my bookings in one place and be able to cancel them.

**Description:**  
The "Upcoming Adventures" screen manages active bookings.

**BookingCard — Card Structure:**
- **Photo section** (left, `w-80`): activity image + "Confirmed" badge (green)
- **Content section** (right): name, Booking ID (monospace badge), date and time, guest count
- **Preparation Guide**: styled block with a Sparkles icon and instructional text
- **Footer**: total price (`€ totalPrice`) + action buttons

**Two-step Cancellation:**
1. Click "Cancel" → inline confirmation panel appears (`confirmCancel: true`)
2. ✓ (Check) → `onCancelBooking(id)` → status set to `Cancelled` → card exits the list
3. ✗ (X) → returns to normal state

**Animations (motion/react):**
- Cards appear with `initial={{ opacity: 0, y: 15 }}` → `animate={{ opacity: 1, y: 0 }}`
- Exit animation: `exit={{ opacity: 0, scale: 0.95 }}` via `AnimatePresence`
- Hover: shadow intensifies, image scales up by `scale-103`

**Acceptance Criteria:**
- [ ] Only bookings with status `Confirmed` are displayed
- [ ] Cancellation requires two-step confirmation (guards against accidental clicks)
- [ ] Exit animation fires correctly on cancellation
- [ ] "View Details" opens the detail page for the corresponding activity
- [ ] When the list is empty, `EmptyBookingsState` is shown with an "Explore" button

---

### TASK-09 · Booking Persistence via localStorage

**Type:** Story  
**Priority:** Medium  
**Components:**
- [`src/hooks/useBookings.ts`](src/hooks/useBookings.ts)

**User Story:**  
> As a user, I want my bookings to persist after a page reload without needing to register.

**Description:**  
The `useBookings` custom hook encapsulates all booking state management with `localStorage` synchronisation.

**Storage Key:** `shoreline_bookings_v1`

**Seed Booking (SL-0041):**  
On first launch (empty `localStorage`), a demo booking for "Beginner Surf Lesson" on June 12 for 2 guests at €90 is automatically created. This allows the Dashboard UI to be demonstrated immediately without completing the full booking flow.

**Hook API:**
- `bookings: Booking[]` — current list
- `addBooking(booking)` — prepends a new booking (appears first in the list)
- `cancelBooking(id)` — sets status to `Cancelled` (does not delete the record)
- `saveBookings(list)` — full overwrite (for future bulk-edit operations)

**Corrupted Data Protection:**  
`JSON.parse` is wrapped in `try/catch` → on invalid JSON, graceful fallback to the seed booking is applied automatically.

**Acceptance Criteria:**
- [ ] Bookings persist between page reloads
- [ ] Seed booking SL-0041 is created on first launch
- [ ] On corrupted `localStorage` JSON, graceful fallback to seed booking is applied
- [ ] `addBooking` prepends the new booking to the top of the list
- [ ] `cancelBooking` changes status without deleting the record

---

### TASK-10 · REST API for Activities and Health Check

**Type:** Story  
**Priority:** Medium  
**Components:**
- [`src/app/api/health/route.ts`](src/app/api/health/route.ts)
- [`src/app/api/activities/route.ts`](src/app/api/activities/route.ts)
- [`src/app/api/activities/[id]/route.ts`](src/app/api/activities/[id]/route.ts)

**User Story:**  
> As a developer, I want a standard REST API for activities so that the frontend can fetch data asynchronously.

**Description:**  
Three API routes implemented via Next.js App Router (Route Handlers).

**`GET /api/health`**  
Liveness check. Returns `200 OK` with no body (or minimal JSON). Used for monitoring and health checks in deployment environments.

**`GET /api/activities`**  
Query params: `?category=Surf`, `?date=2026-06-12` (optional, combinable).  
Returns `{ data: ActivitySummary[], total: number }`.  
`ActivitySummary` = `Activity` without the `slots` field (lightweight payload for the list view).  
Date filtering: ISO string → `new Date()` → formatted to `"June 12"` → matches activities with a slot on that date where `full: false`.

**`GET /api/activities/:id`**  
Returns the full `Activity` object including all slots with `spotsLeft` and `full`.  
Returns `404` if the `id` is not found in the catalogue.

**Typing:**  
The API contract strictly follows interfaces from [`src/types.ts`](src/types.ts): `Activity`, `ActivitySummary`, `Booking`, `BookingAttempt`.

**Acceptance Criteria:**
- [ ] `GET /api/health` returns `200 OK`
- [ ] `GET /api/activities` without params returns all 5 activities
- [ ] `GET /api/activities?category=Surf` returns only Surf activities
- [ ] `GET /api/activities?date=2026-06-12` returns only activities with available slots on that date
- [ ] `GET /api/activities/beginner-surf` returns full data including slots
- [ ] `GET /api/activities/unknown-id` returns `404`

---

## Automating Jira Population

To create tasks via Jira REST API v3, you will need:
- `JIRA_BASE_URL` — your domain (`https://your-org.atlassian.net`)
- `JIRA_PROJECT_KEY` — project key (e.g. `SHL`, `SHORE`)
- `JIRA_EMAIL` + `JIRA_API_TOKEN` — from Atlassian Account Settings

```bash
# Example: create a single issue via curl
curl -X POST \
  "$JIRA_BASE_URL/rest/api/3/issue" \
  -H "Authorization: Basic $(echo -n '$JIRA_EMAIL:$JIRA_API_TOKEN' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": { "key": "SHL" },
      "summary": "Activity Catalogue with Cards",
      "issuetype": { "name": "Story" },
      "priority": { "name": "High" },
      "description": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{ "type": "text", "text": "..." }]
        }]
      }
    }
  }'
```

### Automation Options

| Approach | Description | Complexity |
|---|---|---|
| **Python / Node script** | Reads this MD file, parses tasks, creates them via Jira API | Low |
| **Claude + MCP Jira** | AI agent with a Jira MCP server creates tasks directly from chat | Low |
| **GitHub Actions** | Workflow triggered on push to `main` that creates issues | Medium |
| **Atlassian Forge** | Serverless function hosted on the Atlassian platform | High |

> Want to automate this? Say the word — I'll create a Python or Node.js script that reads this file and creates all 10 tasks in your Jira project with a single command.
