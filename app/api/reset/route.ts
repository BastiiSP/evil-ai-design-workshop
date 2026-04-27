import { NextResponse } from "next/server";
import { getPusherServer } from "@/lib/pusher-server";
import { PUSHER_CHANNEL, PUSHER_EVENTS } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");
  if (!adminPassword || provided !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pusher = getPusherServer();
  await pusher.trigger(PUSHER_CHANNEL, PUSHER_EVENTS.RESET, {});
  return NextResponse.json({ ok: true });
}
