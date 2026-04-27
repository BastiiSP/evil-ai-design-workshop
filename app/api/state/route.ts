import { NextResponse } from "next/server";
import { getPusherServer } from "@/lib/pusher-server";
import {
  PUSHER_CHANNEL,
  PUSHER_EVENTS,
  type WorkshopState,
} from "@/lib/types";

export const runtime = "nodejs";

/**
 * Presenter ruft das auf, um eine State-Änderung an alle Clients zu broadcasten.
 * Body: WorkshopState
 * Auth: Header `x-admin-password` muss matchen.
 */
export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");
  if (!adminPassword || provided !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: WorkshopState;
  try {
    body = (await request.json()) as WorkshopState;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.phase !== "string" || typeof body.slideIndex !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const pusher = getPusherServer();
  await pusher.trigger(PUSHER_CHANNEL, PUSHER_EVENTS.STATE, body);

  return NextResponse.json({ ok: true });
}
