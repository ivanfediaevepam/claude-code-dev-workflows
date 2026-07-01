# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ai-chat-api.spec.ts >> TC-12: Exceeding maxGroupSize does not set readyToConfirm to true
- Location: tests/ai-chat-api.spec.ts:45:5

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not true
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const BASE = "http://localhost:3000";
  4  | 
  5  | // Minimal valid activityContext matching the shape expected by the API
  6  | const validActivityContext = {
  7  |   id: "beginner-surf",
  8  |   title: "Beginner Surf Lesson",
  9  |   price: 45,
  10 |   duration: "2 Hours",
  11 |   maxGroupSize: 6,
  12 |   slots: [
  13 |     { id: "slot-bs-1", date: "June 12", time: "10:00 AM - 12:00 PM", spotsLeft: 4, full: false },
  14 |     { id: "slot-bs-2", date: "June 12", time: "2:00 PM - 4:00 PM", spotsLeft: 0, full: true },
  15 |     { id: "slot-bs-3", date: "June 13", time: "10:00 AM - 12:00 PM", spotsLeft: 6, full: false },
  16 |   ],
  17 | };
  18 | 
  19 | // TC-10: Missing `messages` field returns HTTP 400
  20 | test("TC-10: POST /api/chat without messages returns 400", async ({ request }) => {
  21 |   const res = await request.post(`${BASE}/api/chat`, {
  22 |     data: { activityContext: validActivityContext },
  23 |   });
  24 |   expect(res.status()).toBe(400);
  25 |   const body = await res.json();
  26 |   expect(body).toHaveProperty("error");
  27 | });
  28 | 
  29 | // TC-11: Missing `activityContext` field returns HTTP 400
  30 | test("TC-11: POST /api/chat without activityContext returns 400", async ({ request }) => {
  31 |   const res = await request.post(`${BASE}/api/chat`, {
  32 |     data: { messages: [{ sender: "user", text: "Hi" }] },
  33 |   });
  34 |   expect(res.status()).toBe(400);
  35 |   const body = await res.json();
  36 |   expect(body).toHaveProperty("error");
  37 | });
  38 | 
  39 | // TC-12: Booking request exceeding maxGroupSize does not produce readyToConfirm: true
  40 | // BUG (AC3/EC-maxGroupSize): The fallback rule-based parser in /api/chat does NOT
  41 | // validate peopleCount against maxGroupSize. When GEMINI_API_KEY is absent it sets
  42 | // readyToConfirm: true for any recognisable slot even when the requested group size
  43 | // exceeds the activity's limit. This test intentionally fails to surface that gap.
  44 | // The Gemini path does perform this validation correctly per the system instruction.
  45 | test("TC-12: Exceeding maxGroupSize does not set readyToConfirm to true", async ({ request }) => {
  46 |   const res = await request.post(`${BASE}/api/chat`, {
  47 |     data: {
  48 |       messages: [
  49 |         {
  50 |           sender: "user",
  51 |           text: "I want to book June 12 at 10:00 AM for 20 people",
  52 |         },
  53 |       ],
  54 |       activityContext: validActivityContext,
  55 |     },
  56 |   });
  57 |   expect(res.status()).toBe(200);
  58 |   const body = await res.json();
  59 |   expect(body).toHaveProperty("reply");
  60 |   // readyToConfirm must be absent or false when group size exceeds maxGroupSize
  61 |   const readyToConfirm = body.bookingAttempt?.readyToConfirm;
> 62 |   expect(readyToConfirm).not.toBe(true);
     |                              ^ Error: expect(received).not.toBe(expected) // Object.is equality
  63 | });
  64 | 
  65 | // TC-13: Fallback rule-based parser returns valid JSON when GEMINI_API_KEY is absent
  66 | // The fallback is always reachable: if the real key is present the AI handles it;
  67 | // if absent the fallback handles it. Either way the response shape must be valid.
  68 | test("TC-13: POST /api/chat returns valid { reply, bookingAttempt } JSON", async ({ request }) => {
  69 |   const res = await request.post(`${BASE}/api/chat`, {
  70 |     data: {
  71 |       messages: [{ sender: "user", text: "Tell me about this activity" }],
  72 |       activityContext: validActivityContext,
  73 |     },
  74 |   });
  75 |   expect(res.status()).toBe(200);
  76 |   const body = await res.json();
  77 |   expect(typeof body.reply).toBe("string");
  78 |   expect(body.reply.length).toBeGreaterThan(0);
  79 |   // bookingAttempt is either null or an object — never a non-object truthy value
  80 |   if (body.bookingAttempt !== null && body.bookingAttempt !== undefined) {
  81 |     expect(typeof body.bookingAttempt).toBe("object");
  82 |   }
  83 | });
  84 | 
```