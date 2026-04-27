import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Server: ADMIN_PASSWORD nicht gesetzt" },
      { status: 500 }
    );
  }
  if (password === expected) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
}
