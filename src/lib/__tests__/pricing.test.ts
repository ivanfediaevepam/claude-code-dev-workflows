import { calculateTotalPrice, formatGuestLabel } from "@/lib/pricing";

describe("calculateTotalPrice", () => {
  it("multiplies price per person by guest count", () => {
    expect(calculateTotalPrice(45, 2)).toBe(90);
  });

  it("handles a single guest", () => {
    expect(calculateTotalPrice(55, 1)).toBe(55);
  });

  it("returns 0 when the activity is free", () => {
    expect(calculateTotalPrice(0, 4)).toBe(0);
  });

  it("rejects a negative price", () => {
    expect(() => calculateTotalPrice(-1, 2)).toThrow(RangeError);
  });

  it("rejects zero or fractional guests", () => {
    expect(() => calculateTotalPrice(45, 0)).toThrow(RangeError);
    expect(() => calculateTotalPrice(45, 1.5)).toThrow(RangeError);
  });
});

describe("formatGuestLabel", () => {
  it("uses the singular noun for one guest", () => {
    expect(formatGuestLabel(1)).toBe("1 Guest");
  });

  it("uses the plural noun for multiple guests", () => {
    expect(formatGuestLabel(3)).toBe("3 Guests");
  });
});
