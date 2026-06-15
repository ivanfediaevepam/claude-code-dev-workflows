import { NextRequest, NextResponse } from "next/server";
import { ACTIVITIES } from "@/data/activities";

/**
 * GET /api/activities
 *
 * Returns a list of activities, optionally filtered by:
 *  - `category` query param  (e.g. ?category=Surf)
 *  - `date`     query param  (e.g. ?date=2025-06-12 — ISO date string)
 *
 * Response shape:
 * {
 *   data: ActivitySummary[]   // lightweight list items (no slots detail)
 *   total: number
 * }
 */

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const date = searchParams.get("date");

  let activities = ACTIVITIES;

  // Filter by category
  if (category && category !== "All") {
    activities = activities.filter((a) => a.category === category);
  }

  // Filter by date — keep activities that have at least one non-full slot on that date
  if (date) {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      const month = parsed.toLocaleString("en-US", { month: "long" });
      const day = parsed.getDate();
      const seekerQuery = `${month} ${day}`; // e.g. "June 12"

      activities = activities.filter((a) =>
        a.slots.some(
          (slot) =>
            slot.date.toLowerCase() === seekerQuery.toLowerCase() && !slot.full
        )
      );
    }
  }

  // Return a lightweight summary (omit slots from list view)
  const data = activities.map(({ slots: _slots, ...rest }) => rest);

  return NextResponse.json({ data, total: data.length });
}
