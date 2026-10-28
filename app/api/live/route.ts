import { getLiveState } from "@/lib/live";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getLiveState();
  // Live ho to jaldi badlav pakadne ke liye 1 minute, warna 2 minute
  const ttl = state.mode === "live" ? 60 : 120;

  return NextResponse.json(state, {
    headers: { "Cache-Control": `public, max-age=30, s-maxage=${ttl}` },
  });
}