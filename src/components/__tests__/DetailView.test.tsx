import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import DetailView from "@/components/DetailView";
import { Activity } from "@/types";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

const mockActivity: Activity = {
  id: "test-activity",
  title: "Test Activity",
  price: 50,
  duration: "2 hours",
  availability: "Available",
  image: "/test.jpg",
  category: "Surf",
  rating: 4.8,
  reviewsCount: 120,
  description: "A test activity.",
  tags: ["fun"],
  maxGroupSize: 8,
  slots: [
    { id: "slot-1", date: "June 17", time: "10:00 AM", spotsLeft: 5, full: false },
  ],
};

function mockFetchWithBookingAttempt(date: string) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      reply: "Great, I have your slot ready!",
      bookingAttempt: {
        date,
        time: "10:00 AM",
        people: 2,
        readyToConfirm: true,
      },
    }),
  } as unknown as Response);
}

describe("DetailView — booking success message", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("success message contains the booked date, not a hardcoded date", async () => {
    const bookedDate = "June 17";
    mockFetchWithBookingAttempt(bookedDate);

    render(
      <DetailView
        activity={mockActivity}
        onGoBack={jest.fn()}
        onAddBooking={jest.fn()}
      />
    );

    // Send a chat message to trigger the booking attempt flow
    const input = screen.getByPlaceholderText(/june 12 at 10 am/i);
    fireEvent.change(input, { target: { value: "Book June 17 at 10:00 AM for 2 people" } });
    fireEvent.submit(input.closest("form")!);

    // Wait for the confirm button to appear (set by the mocked chat API response)
    const confirmButton = await screen.findByRole("button", { name: /confirm booking/i });
    fireEvent.click(confirmButton);

    // The success message should contain the actual booked date
    await waitFor(() => {
      const messages = screen.getAllByText(/congratulations/i);
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0]).toHaveTextContent(bookedDate);
    });
  });
});
