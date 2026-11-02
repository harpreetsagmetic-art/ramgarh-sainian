import { getDay, getRange, istDate, toItems } from "@/lib/gurpurab";
import { secondsUntilIst } from "@/lib/ist";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const today = istDate(0);
  const weekAhead = istDate(7);

  // Ye sab fetch pehle se 6 ghante cache hote hain, to naya network call kam hi jaata hai
  const [day, range] = await Promise.all([getDay(today), getRange(31)]);

  const future = toItems(range).filter((i) => i.date > today);
  const nextGurpurab = future.find((i) => i.kind === "gurpurab") ?? null;
  const historySoon = future.filter((i) => i.kind === "historical" && i.date <= weekAhead);

  const ttl = day ? secondsUntilIst(0) : 120; // raat 12 baje (IST) tak

  return NextResponse.json(
    { day, nextGurpurab, historySoon },
    { headers: { "Cache-Control": `public, max-age=60, s-maxage=${ttl}` } }
  );
}