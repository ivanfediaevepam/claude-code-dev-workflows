import { renderHook, act } from "@testing-library/react";
import { useBookings } from "@/hooks/useBookings";
import { Booking } from "@/types";

const KEY = "shoreline_bookings_v1";

const STUB_BOOKING: Booking = {
  id: "SL-9999",
  activityId: "kayak-tour",
  activityTitle: "Kayak Tour",
  activityCategory: "Water",
  activityImage: "https://example.com/img.jpg",
  date: "June 20",
  time: "09:00 AM - 11:00 AM",
  peopleCount: 1,
  totalPrice: 55,
  status: "Confirmed",
  preparationGuide: "Bring sunscreen.",
};

beforeEach(() => {
  localStorage.clear();
});

describe("useBookings — initial load", () => {
  it("seeds the initial booking when localStorage is empty", () => {
    const { result } = renderHook(() => useBookings());
    expect(result.current.bookings).toHaveLength(1);
    expect(result.current.bookings[0].id).toBe("SL-0041");
  });

  it("writes the seed to localStorage so the next mount finds it", () => {
    renderHook(() => useBookings());
    const stored = JSON.parse(localStorage.getItem(KEY)!);
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe("SL-0041");
  });

  it("loads bookings that were already persisted in localStorage", () => {
    localStorage.setItem(KEY, JSON.stringify([STUB_BOOKING]));
    const { result } = renderHook(() => useBookings());
    expect(result.current.bookings).toHaveLength(1);
    expect(result.current.bookings[0].id).toBe("SL-9999");
  });

  it("falls back to the initial booking when localStorage contains corrupt JSON", () => {
    // Matters: a storage write race or manual edit could leave unparseable JSON;
    // silently swallowing the error and showing the seed prevents a blank screen.
    localStorage.setItem(KEY, "not-valid-json{{");
    const { result } = renderHook(() => useBookings());
    expect(result.current.bookings).toHaveLength(1);
    expect(result.current.bookings[0].id).toBe("SL-0041");
  });
});

describe("useBookings — addBooking", () => {
  it("prepends the new booking so it appears first in the list", () => {
    const { result } = renderHook(() => useBookings());
    act(() => {
      result.current.addBooking(STUB_BOOKING);
    });
    expect(result.current.bookings[0].id).toBe("SL-9999");
    expect(result.current.bookings[1].id).toBe("SL-0041");
  });

  it("persists the updated list to localStorage", () => {
    const { result } = renderHook(() => useBookings());
    act(() => {
      result.current.addBooking(STUB_BOOKING);
    });
    const stored: Booking[] = JSON.parse(localStorage.getItem(KEY)!);
    expect(stored[0].id).toBe("SL-9999");
  });
});

describe("useBookings — cancelBooking", () => {
  it("sets the matching booking status to Cancelled", () => {
    localStorage.setItem(KEY, JSON.stringify([STUB_BOOKING]));
    const { result } = renderHook(() => useBookings());
    act(() => {
      result.current.cancelBooking("SL-9999");
    });
    expect(result.current.bookings[0].status).toBe("Cancelled");
  });

  it("leaves other bookings untouched when one is cancelled", () => {
    const other: Booking = { ...STUB_BOOKING, id: "SL-0001" };
    localStorage.setItem(KEY, JSON.stringify([STUB_BOOKING, other]));
    const { result } = renderHook(() => useBookings());
    act(() => {
      result.current.cancelBooking("SL-9999");
    });
    expect(result.current.bookings[1].status).toBe("Confirmed");
  });

  it("persists the cancellation to localStorage", () => {
    localStorage.setItem(KEY, JSON.stringify([STUB_BOOKING]));
    const { result } = renderHook(() => useBookings());
    act(() => {
      result.current.cancelBooking("SL-9999");
    });
    const stored: Booking[] = JSON.parse(localStorage.getItem(KEY)!);
    expect(stored[0].status).toBe("Cancelled");
  });
});
