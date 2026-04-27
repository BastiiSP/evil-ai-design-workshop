import { NextResponse } from "next/server";
import { getQuestions } from "@/lib/questions";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getQuestions());
}
