import { NextRequest, NextResponse } from "next/server";
import { ACTIVITIES } from "@/data/activities";

/**
 * GET /api/activities/[id]/availability
 *
 * Returns the bookable slots for a single activity plus a spotsTotal sum.
 *
 * Response shape (success — 200):
 * {
 *   data: {
 *     slots: { id, date, time, spotsLeft, full }[]
 *     spotsTotal: number
 *   }
 * }
 *
 * Response shape (not found — 404):
 * {
 *   error: string
 * }
 */

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;

  const activity = ACTIVITIES.find((a) => a.id === id);

  if (!activity) {
    return NextResponse.json(
      { error: `Activity with id "${id}" not found.` },
      { status: 404 }
    );
  }

  const spotsTotal = activity.slots.reduce((sum, s) => sum + s.spotsLeft, 0);

  return NextResponse.json({
    data: {
      slots: activity.slots,
      spotsTotal,
    },
  });
}
