import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

// Minimal valid activityContext matching the shape expected by the API
const validActivityContext = {
  id: "beginner-surf",
  title: "Beginner Surf Lesson",
  price: 45,
  duration: "2 Hours",
  maxGroupSize: 6,
  slots: [
    { id: "slot-bs-1", date: "June 12", time: "10:00 AM - 12:00 PM", spotsLeft: 4, full: false },
    { id: "slot-bs-2", date: "June 12", time: "2:00 PM - 4:00 PM", spotsLeft: 0, full: true },
    { id: "slot-bs-3", date: "June 13", time: "10:00 AM - 12:00 PM", spotsLeft: 6, full: false },
  ],
};

// TC-10: Missing `messages` field returns HTTP 400
test("TC-10: POST /api/chat without messages returns 400", async ({ request }) => {
  const res = await request.post(`${BASE}/api/chat`, {
    data: { activityContext: validActivityContext },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body).toHaveProperty("error");
});

// TC-11: Missing `activityContext` field returns HTTP 400
test("TC-11: POST /api/chat without activityContext returns 400", async ({ request }) => {
  const res = await request.post(`${BASE}/api/chat`, {
    data: { messages: [{ sender: "user", text: "Hi" }] },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body).toHaveProperty("error");
});

// TC-12: Booking request exceeding maxGroupSize does not produce readyToConfirm: true
// BUG (AC3/EC-maxGroupSize): The fallback rule-based parser in /api/chat does NOT
// validate peopleCount against maxGroupSize. When GEMINI_API_KEY is absent it sets
// readyToConfirm: true for any recognisable slot even when the requested group size
// exceeds the activity's limit. This test intentionally fails to surface that gap.
// The Gemini path does perform this validation correctly per the system instruction.
test("TC-12: Exceeding maxGroupSize does not set readyToConfirm to true", async ({ request }) => {
  const res = await request.post(`${BASE}/api/chat`, {
    data: {
      messages: [
        {
          sender: "user",
          text: "I want to book June 12 at 10:00 AM for 20 people",
        },
      ],
      activityContext: validActivityContext,
    },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body).toHaveProperty("reply");
  // readyToConfirm must be absent or false when group size exceeds maxGroupSize
  const readyToConfirm = body.bookingAttempt?.readyToConfirm;
  expect(readyToConfirm).not.toBe(true);
});

// TC-13: Fallback rule-based parser returns valid JSON when GEMINI_API_KEY is absent
// The fallback is always reachable: if the real key is present the AI handles it;
// if absent the fallback handles it. Either way the response shape must be valid.
test("TC-13: POST /api/chat returns valid { reply, bookingAttempt } JSON", async ({ request }) => {
  const res = await request.post(`${BASE}/api/chat`, {
    data: {
      messages: [{ sender: "user", text: "Tell me about this activity" }],
      activityContext: validActivityContext,
    },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(typeof body.reply).toBe("string");
  expect(body.reply.length).toBeGreaterThan(0);
  // bookingAttempt is either null or an object — never a non-object truthy value
  if (body.bookingAttempt !== null && body.bookingAttempt !== undefined) {
    expect(typeof body.bookingAttempt).toBe("object");
  }
});
