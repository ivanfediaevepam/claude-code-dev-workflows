import { NextRequest, NextResponse } from "next/server";
import { ACTIVITIES } from "@/data/activities";

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

  const { rating, reviewsCount, tags } = activity;
  return NextResponse.json({ data: { rating, reviewsCount, tags } });
}
