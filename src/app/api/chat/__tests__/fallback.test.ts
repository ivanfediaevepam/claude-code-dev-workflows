/**
 * @jest-environment node
 *
 * Tests for the rule-based fallback parser that runs when GEMINI_API_KEY is absent.
 * The parser is embedded in the POST handler; we drive it by calling POST directly
 * with no API key set, which makes createAiClient() return null and routes every
 * request through the fallback branch.
 */
// @google/genai ships ESM-only (.mjs); Jest runs in CJS mode and cannot parse
// it directly.  The fallback branch never instantiates the client (no API key),
// so a minimal stub is all we need.
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn(),
  Type: {},
}));

import { POST } from "@/app/api/chat/route";
import { NextRequest } from "next/server";

// Ensure the Gemini client is never instantiated during these tests.
// (createAiClient returns null when the env var is absent.)
delete process.env.GEMINI_API_KEY;

const ACTIVITY = {
  title: "Beginner Surf Lesson",
  price: 45,
  duration: "2 hours",
  maxGroupSize: 6,
  slots: [
    { date: "June 12", time: "10:00 AM - 12:00 PM", spotsLeft: 4, full: false },
    { date: "June 13", time: "10:00 AM - 12:00 PM", spotsLeft: 0, full: true },
  ],
};

function makeRequest(text: string) {
  return new NextRequest("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ sender: "user", text }],
      activityContext: ACTIVITY,
    }),
  });
}

async function post(text: string) {
  const res = await POST(makeRequest(text));
  return res.json();
}

describe("fallback parser — date + time matching", () => {
  it("recognises 'June 12' with '10' and sets readyToConfirm", async () => {
    const { bookingAttempt } = await post("June 12 at 10 please");
    expect(bookingAttempt?.readyToConfirm).toBe(true);
    expect(bookingAttempt?.date).toBe("June 12");
    expect(bookingAttempt?.time).toBe("10:00 AM - 12:00 PM");
  });

  it("recognises 'June 12' with 'TEN' (word form) and sets readyToConfirm", async () => {
    const { bookingAttempt } = await post("June 12 at ten in the morning");
    expect(bookingAttempt?.readyToConfirm).toBe(true);
    expect(bookingAttempt?.date).toBe("June 12");
  });

  it("recognises 'June 13' with '10' and sets readyToConfirm", async () => {
    const { bookingAttempt } = await post("June 13, 10 AM works for me");
    expect(bookingAttempt?.readyToConfirm).toBe(true);
    expect(bookingAttempt?.date).toBe("June 13");
  });
});

describe("fallback parser — guest count extraction", () => {
  it("extracts an explicit digit from the message as the people count", async () => {
    // Matters: the booking total price and confirmation copy depend on the
    // correct headcount being captured; defaulting to 2 would silently overcharge.
    const { bookingAttempt } = await post("June 12 at 10 for 3 people");
    expect(bookingAttempt?.people).toBe(3);
  });

  it("defaults people to 2 when no digit 1–6 appears in the message", async () => {
    const { bookingAttempt } = await post("June 12 at ten please");
    expect(bookingAttempt?.people).toBe(2);
  });

  it("uses singular 'guest(s)' phrasing in the reply regardless of count", async () => {
    // Matters: the reply text is shown to the user; grammatically wrong copy
    // degrades trust in the assistant.
    const { reply } = await post("June 12 at 10 for 1 person");
    expect(reply).toMatch(/1 guest\(s\)/i);
  });
});

describe("fallback parser — no date provided", () => {
  it("sets readyToConfirm to false when only a guest count is given", async () => {
    // Matters: surfacing a confirmation panel without a date would create a
    // booking with missing slot information.
    const { bookingAttempt } = await post("2 guests");
    expect(bookingAttempt?.readyToConfirm).toBe(false);
  });

  it("includes available slot dates in the reply when no date is given", async () => {
    const { reply } = await post("just 2 of us");
    expect(reply).toMatch(/june 12/i);
    expect(reply).toMatch(/june 13/i);
  });
});

describe("fallback parser — generic greeting (no date, no count)", () => {
  it("returns null bookingAttempt for an unrecognised message", async () => {
    const { bookingAttempt } = await post("Hello there!");
    expect(bookingAttempt).toBeNull();
  });

  it("mentions the activity title in the generic reply", async () => {
    const { reply } = await post("Hello there!");
    expect(reply).toContain("Beginner Surf Lesson");
  });
});

describe("fallback parser — known gaps (documented behaviour)", () => {
  it("does NOT reject a booking attempt for a FULL slot", async () => {
    // Gap: the fallback hardcodes availability copy ("spots available") and
    // never inspects the `full` flag on activityContext.slots.  A guest asking
    // for June 13 (full: true) still gets readyToConfirm: true.
    // The Gemini path handles this correctly; the fallback should be tightened
    // if the API is permanently unavailable.
    const { bookingAttempt } = await post("June 13 at 10 please");
    expect(bookingAttempt?.readyToConfirm).toBe(true); // current (buggy) behaviour
  });

  it("does NOT enforce maxGroupSize — a count of 6 still confirms", async () => {
    // Gap: the regex cap of [1-6] in the fallback is coincidentally the same as
    // the default maxGroupSize, but a different activity with maxGroupSize=2 would
    // silently allow overbooking.  The Gemini path enforces this via its prompt.
    const { bookingAttempt } = await post("June 12 at 10 for 6 guests");
    expect(bookingAttempt?.people).toBe(6);
    expect(bookingAttempt?.readyToConfirm).toBe(true);
  });
});

describe("fallback parser — bad request body", () => {
  it("returns 400 when the request body is missing messages", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityContext: ACTIVITY }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
