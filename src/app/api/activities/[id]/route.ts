import { NextRequest, NextResponse } from "next/server";
import { ACTIVITIES } from "@/data/activities";

/**
 * GET /api/activities/[id]
 *
 * Returns full details for a single activity, including its time slots.
 *
 * Response shape (success — 200):
 * {
 *   data: Activity   // full activity object with slots
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

  return NextResponse.json({ data: activity });
}
