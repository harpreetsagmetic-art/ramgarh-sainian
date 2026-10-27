import { loadHukamnama } from "@/lib/hukamnama";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // har request par chale, build par nahi

export async function GET() {
  const { data, isCurrent, ttl } = await loadHukamnama();

  return NextResponse.json(
    { data, isCurrent },
    {
      headers: {
        // browser sirf 1 minute, CDN `ttl` second (sahi date ho to agle 4 baje tak)
        "Cache-Control": `public, max-age=60, s-maxage=${ttl}`,
      },
    }
  );
}