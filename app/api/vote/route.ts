import { NextResponse } from "next/server";
import { getPusherServer } from "@/lib/pusher-server";
import {
  PUSHER_CHANNEL,
  PUSHER_EVENTS,
  type VotePayload,
} from "@/lib/types";
import { getQuestionById } from "@/lib/questions";

export const runtime = "nodejs";

/**
 * Smartphone schickt Vote, Server broadcastet via Pusher.
 * Server selbst ist stateless – Aggregation passiert beim Presenter-Client.
 */
export async function POST(request: Request) {
  let body: VotePayload;
  try {
    body = (await request.json()) as VotePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.questionId || !body.optionId || !body.clientId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const question = getQuestionById(body.questionId);
  if (!question) {
    return NextResponse.json({ error: "Unknown question" }, { status: 404 });
  }
  if (!question.options.find((o) => o.id === body.optionId)) {
    return NextResponse.json({ error: "Unknown option" }, { status: 400 });
  }

  const pusher = getPusherServer();
  await pusher.trigger(PUSHER_CHANNEL, PUSHER_EVENTS.VOTE, body);

  return NextResponse.json({ ok: true });
}
