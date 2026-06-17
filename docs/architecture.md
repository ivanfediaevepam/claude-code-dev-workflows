# Architecture Diagrams

## AI Booking Chat — Data Flow

```mermaid
sequenceDiagram
    actor User
    participant Panel as AIAssistantPanel<br/>(DetailView.tsx)
    participant API as POST /api/chat<br/>(route.ts)
    participant Gemini as Gemini 2.5 Flash
    participant FB as Rule-Based Fallback<br/>(route.ts)
    participant ClientFB as Client Fallback<br/>(DetailView.tsx)
    participant LS as localStorage<br/>(useBookings.ts)

    User->>Panel: Types message & submits form
    Panel->>Panel: Appends user ChatMessage to state
    Panel->>Panel: setIsTyping(true)
    Panel->>API: POST /api/chat<br/>{ messages[], activityContext, systemTime }

    alt GEMINI_API_KEY present
        API->>Gemini: generateContent(prompt, systemInstruction)<br/>responseMimeType: application/json
        Gemini-->>API: { reply, bookingAttempt? }
        API-->>Panel: 200 { reply, bookingAttempt? }
    else API key missing or Gemini throws
        API->>FB: Rule-based keyword match<br/>(date + time + guest count in message)
        FB-->>API: { reply, bookingAttempt? }
        API-->>Panel: 200 { reply, bookingAttempt? }
    else fetch() itself fails (network error)
        API--XPanel: error thrown
        Panel->>ClientFB: catch block — local keyword parser<br/>(setTimeout 1 s)
        ClientFB-->>Panel: { reply, attempt }
    end

    Panel->>Panel: setIsTyping(false)
    Panel->>Panel: Appends assistant ChatMessage to state
    Panel->>Panel: setBookingAttempt(data.bookingAttempt)

    alt bookingAttempt.readyToConfirm === true
        Panel->>User: Renders BookingConfirmCard in chat
        User->>Panel: Clicks "Confirm" button
        Panel->>Panel: executeConfirmBooking()<br/>builds Booking object via calculateTotalPrice()
        Panel->>LS: addBooking(newBooking)<br/>prepends to shoreline_bookings_v1
        Panel->>Panel: setIsBookedSuccess(true), clears bookingAttempt
        Panel->>User: Appends success ChatMessage with Booking ID
    else readyToConfirm === false
        Panel->>User: Shows assistant reply only<br/>(still gathering date / guest count)
    end
```

**Key facts from the code:**

- `bookingAttempt` shape: `{ date, time, people, readyToConfirm }` — returned by both Gemini and the fallbacks.
- The server-side fallback (`route.ts` lines 140–201) matches hard-coded date strings ("JUNE 12", "JUNE 13") and a digit regex.
- The client-side fallback (`DetailView.tsx` lines 91–142) is only reached when the `fetch()` itself throws (network error), not on a non-2xx response.
- `executeConfirmBooking()` (`DetailView.tsx:150`) constructs the `Booking` and calls `onAddBooking`, which is `useBookings.addBooking` — that writes to `localStorage` under key `shoreline_bookings_v1`.
- The success message on line 179 hardcodes "June 12" (known bug — it should use `newBooking.date`).

## React Component Hierarchy

```mermaid
flowchart TD
    Layout["RootLayout\n(app/layout.tsx)"]
    NavBar["NavBar"]
    Footer["Footer"]
    Main["&lt;main&gt; {children}"]

    Layout --> NavBar
    Layout --> Main
    Layout --> Footer

    Home["HomePage\n(app/page.tsx)\nuseRouter"]
    Detail["ActivityPage\n(app/activities/[id]/page.tsx)\nuseRouter · useBookings · fetch /api/activities/:id"]
    Bookings["BookingsPage\n(app/bookings/page.tsx)\nuseRouter · useBookings"]

    Main --> Home
    Main --> Detail
    Main --> Bookings

    LV["ListingView"]
    HeroSection["HeroSection"]
    FilterBar["FilterBar"]
    ActivityCard["ActivityCard (×n)"]
    EmptyActivities["EmptyActivitiesState"]

    Home --> LV
    LV --> HeroSection
    LV --> FilterBar
    LV --> ActivityCard
    LV --> EmptyActivities

    DV["DetailView"]
    ActivitySpecs["ActivitySpecs"]
    AvailabilitySlots["AvailabilitySlots"]
    AIPanel["AIAssistantPanel"]
    ChatBubble["ChatMessageBubble (×n)"]
    ConfirmCard["BookingConfirmCard\n(shown when readyToConfirm=true)"]

    Detail --> DV
    DV --> ActivitySpecs
    DV --> AvailabilitySlots
    DV --> AIPanel
    AIPanel --> ChatBubble
    AIPanel --> ConfirmCard

    BV["BookingsView"]
    BookingCard["BookingCard (×n)"]
    EmptyBookings["EmptyBookingsState"]

    Bookings --> BV
    BV --> BookingCard
    BV --> EmptyBookings
```

**Key facts from the code:**

- `RootLayout` (`app/layout.tsx`) wraps every route with `NavBar` and `Footer`; the route page renders into `<main>`.
- Page components own routing (`useRouter`) and data fetching. `ActivityPage` fetches `GET /api/activities/[id]` client-side and owns the `useBookings` hook; confirming a booking calls `addBooking` then redirects to `/bookings`.
- `BookingsPage` also owns `useBookings` directly — both pages read/write the same `localStorage` key (`shoreline_bookings_v1`) via the hook.
- `DetailView` holds all chat state (`messages`, `bookingAttempt`, `isTyping`) and passes callbacks down to `AIAssistantPanel`. `BookingConfirmCard` is rendered inline in the chat stream, not as a modal.
- `AvailabilitySlots` clicking a slot calls `handleSendMessage` with a pre-filled prompt, bypassing the text input.
