/**
 * Pricing helpers for bookings.
 *
 * This is the project's "golden" reference module: a small, pure, fully-typed
 * unit with a co-located test in `__tests__/pricing.test.ts`. New utilities and
 * their tests should follow this shape — pure functions, explicit edge-case
 * handling, and behaviour-focused tests.
 */

/**
 * Total price for a booking.
 *
 * @param pricePerPerson - Per-guest price in euros (must be >= 0).
 * @param guests - Number of guests (must be a positive integer).
 * @returns The total price in euros.
 * @throws RangeError if inputs are negative or `guests` is not a positive integer.
 */
export function calculateTotalPrice(pricePerPerson: number, guests: number): number {
  if (pricePerPerson < 0) {
    throw new RangeError("pricePerPerson must be >= 0");
  }
  if (!Number.isInteger(guests) || guests < 1) {
    throw new RangeError("guests must be a positive integer");
  }
  return pricePerPerson * guests;
}

/**
 * Human-readable guest count label, e.g. `1 Guest` / `3 Guests`.
 *
 * @param guests - Number of guests.
 * @returns A label with the correct singular/plural noun.
 */
export function formatGuestLabel(guests: number): string {
  return `${guests} ${guests === 1 ? "Guest" : "Guests"}`;
}
