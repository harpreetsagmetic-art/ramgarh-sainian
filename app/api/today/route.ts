import { istDate, toItems } from "@/lib/gurpurab";
import { getDay, getRange } from "@/lib/jantri";
import { secondsUntilIst } from "@/lib/ist";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EMPTY = { day: null, nextGurpurab: null, historySoon: [] };

export async function GET() {
  try {
    const today = istDate(0);
    const weekAhead = istDate(7);

    const [day, range] = await Promise.all([getDay(today), getRange(31)]);

    const future = toItems(range).filter((i) => i.date > today);
    const nextGurpurab = future.find((i) => i.kind === "gurpurab") ?? null;
    const historySoon = future.filter((i) => i.kind === "historical" && i.date <= weekAhead);

    // Raat 12 baje (IST) tak cache (data local hai, isliye hamesha mil jaata hai)
    const ttl = day ? secondsUntilIst(0) : 120;

    return NextResponse.json(
      { day, nextGurpurab, historySoon },
      { headers: { "Cache-Control": `public, max-age=60, s-maxage=${ttl}` } },
    );
  } catch (e) {
    console.error("[api/today]", e);
    return NextResponse.json(EMPTY, { headers: { "Cache-Control": "public, max-age=30, s-maxage=60" } });
  }
}