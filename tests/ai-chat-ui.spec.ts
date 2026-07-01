import { test, expect, Page } from "@playwright/test";

const ACTIVITY_URL = "http://localhost:3000/activities/beginner-surf";

// The scrollable chat message list inside the AI panel
const CHAT_PANEL = 'div.flex-grow.p-4.overflow-y-auto';

// Helper: type a message and click Send, then wait for the user bubble to appear.
// force:true bypasses animation-stability checks on the button.
async function sendMessage(page: Page, text: string) {
  const input = page.getByPlaceholder(/E\.g\., June 12/i);
  await input.fill(text);
  await page.locator('button[type="submit"]').click({ force: true });
  // Wait until the user's message bubble is visible in the chat
  await expect(page.locator(CHAT_PANEL)).toContainText(text, { timeout: 10_000 });
}

// Helper: wait for the typing indicator to disappear (response received)
async function waitForResponse(page: Page) {
  // First ensure the typing indicator appears
  await expect(page.getByText("Tuning availability...")).toBeVisible({ timeout: 10_000 });
  // Then wait for it to vanish (response rendered)
  await expect(page.getByText("Tuning availability...")).toBeHidden({ timeout: 45_000 });
}

// TC-07: Send button disabled on page load (empty input)
test("TC-07: Send button is disabled on page load", async ({ page }) => {
  await page.goto(ACTIVITY_URL);
  const sendBtn = page.locator('button[type="submit"]');
  await expect(sendBtn).toBeDisabled();
});

// TC-08: Send button enables when text typed, disables when cleared
test("TC-08: Send button enables on input and disables when cleared", async ({ page }) => {
  await page.goto(ACTIVITY_URL);
  const input = page.getByPlaceholder(/E\.g\., June 12/i);
  const sendBtn = page.locator('button[type="submit"]');

  await input.fill("Hello");
  await expect(sendBtn).toBeEnabled();

  await input.fill("");
  await expect(sendBtn).toBeDisabled();
});

// TC-01: Assistant reply references the current activity
test("TC-01: Assistant responds in the context of the specific activity", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto(ACTIVITY_URL);
  await sendMessage(page, "What does this activity include?");
  await waitForResponse(page);

  // The reply should mention something related to the Beginner Surf Lesson
  await expect(page.locator(CHAT_PANEL)).toContainText(/(surf|lesson|beginner|activity|book)/i);
});

// TC-05: Typing indicator ("Tuning availability...") appears while awaiting response
test("TC-05: Typing indicator appears while waiting for a response", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto(ACTIVITY_URL);
  const input = page.getByPlaceholder(/E\.g\., June 12/i);
  await input.fill("Tell me more about this activity.");

  await page.locator('button[type="submit"]').click({ force: true });

  // The indicator must appear while the request is in flight
  await expect(page.getByText("Tuning availability...")).toBeVisible({ timeout: 10_000 });

  // Wait for it to disappear (response received)
  await expect(page.getByText("Tuning availability...")).toBeHidden({ timeout: 45_000 });
});

// TC-09: Send button disabled while typing indicator is active
test("TC-09: Send button is disabled while typing indicator is active", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto(ACTIVITY_URL);
  const input = page.getByPlaceholder(/E\.g\., June 12/i);
  await input.fill("What is included?");

  await page.locator('button[type="submit"]').click({ force: true });

  // While the typing indicator is visible the button must be disabled
  await expect(page.getByText("Tuning availability...")).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('button[type="submit"]')).toBeDisabled();

  await expect(page.getByText("Tuning availability...")).toBeHidden({ timeout: 45_000 });
});

// TC-03: No BookingConfirmCard when only a date is provided (incomplete booking)
test("TC-03: No BookingConfirmCard shown for partial booking details", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto(ACTIVITY_URL);
  await sendMessage(page, "I want to book on June 13th.");
  await waitForResponse(page);

  // BookingConfirmCard should NOT be present (readyToConfirm not set)
  await expect(page.locator(CHAT_PANEL).getByText(/confirm booking/i)).not.toBeVisible();
});

// TC-04: BookingConfirmCard appears after full booking details collected
test("TC-04: BookingConfirmCard appears when all booking details are provided", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto(ACTIVITY_URL);
  // Fallback parser triggers readyToConfirm on "June 12" + "10" in the message
  await sendMessage(page, "I'd like to book June 12 at 10 AM for 2 people");
  await waitForResponse(page);

  // BookingConfirmCard should render inside the chat panel
  await expect(page.locator(CHAT_PANEL).getByText(/confirm booking/i)).toBeVisible({ timeout: 10_000 });
});

// TC-02: Requesting a full slot — assistant suggests an alternative
test("TC-02: Requesting a full slot results in the assistant suggesting an alternative", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto(ACTIVITY_URL);
  // slot-bs-2: June 12 at 2:00 PM is marked full
  await sendMessage(page, "I'd like to book June 12 at 2:00 PM");
  await waitForResponse(page);

  // No BookingConfirmCard should appear for a full slot
  await expect(page.locator(CHAT_PANEL).getByText(/confirm booking/i)).not.toBeVisible();

  // The reply should mention an alternative or unavailability
  await expect(page.locator(CHAT_PANEL)).toContainText(/(full|unavailable|alternative|10:00|June 13)/i);
});

// TC-06: Chat auto-scrolls so the latest message is visible
test("TC-06: Chat auto-scrolls to the latest message", async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto(ACTIVITY_URL);

  const messages = [
    "Tell me about this activity.",
    "What days are available?",
    "How many people can join?",
    "Is June 12 available?",
    "What time slots are open?",
  ];

  for (const msg of messages) {
    await sendMessage(page, msg);
    await waitForResponse(page);
  }

  // The last assistant message should be visible in the viewport
  const chatMessages = page.locator(`${CHAT_PANEL} > .flex`);
  const lastMessage = chatMessages.last();
  await expect(lastMessage).toBeInViewport();
});
