import { getDay, istDate } from "@/lib/gurpurab";
import { secondsUntilIst } from "@/lib/ist";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const day = await getDay(istDate(0));
  const ttl = day ? secondsUntilIst(0) : 120; // raat 12 baje (IST) tak

  return NextResponse.json(
    { day },
    { headers: { "Cache-Control": `public, max-age=60, s-maxage=${ttl}` } }
  );
}