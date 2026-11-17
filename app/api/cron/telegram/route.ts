import { sendMessages, validateHtml } from "@/lib/telegram";
import { buildDigest, buildHukamnama } from "@/lib/telegram-messages";
import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authorized(req: NextRequest, secret: string): boolean {
  const a = Buffer.from(req.headers.get("authorization") ?? "");
  const b = Buffer.from(`Bearer ${secret}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Vercel Cron roz is route ko GET se bulata hai (Authorization: Bearer CRON_SECRET ke saath).
//   ?part=all|digest|hukamnama   (default: all)
//   ?dry=1                       bhejo mat, sirf message dikhao
//   ?date=2026-11-24             digest ko us din ke hisaab se banao (test ke liye)
//   ?force=1                     Hukamnama ki date match na ho tab bhi bhejo
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) {
    return NextResponse.json(
      { error: "CRON_SECRET set nahi hai (kam se kam 16 akshar)" },
      { status: 500 },
    );
  }
  if (!authorized(req, secret))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const part = sp.get("part") ?? "all";
  const dry = sp.get("dry") === "1";
  const force = sp.get("force") === "1";
  const dateParam = sp.get("date");
  const date =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : undefined;

  try {
    const messages: { part: string; html: string }[] = [];
    const skipped: string[] = [];

    if (part === "all" || part === "digest") {
      for (const html of await buildDigest(date))
        messages.push({ part: "digest", html });
    }
    if (part === "all" || part === "hukamnama") {
      const h = await buildHukamnama(force);
      if (h.reason) skipped.push(h.reason);
      for (const html of h.messages) messages.push({ part: "hukamnama", html });
    }

    const problems = messages.flatMap((m, i) =>
      validateHtml(m.html).map((p) => `message ${i + 1} (${m.part}): ${p}`),
    );

    if (dry) {
      return NextResponse.json({
        dry: true,
        problems,
        skipped,
        messages: messages.map((m) => ({
          part: m.part,
          chars: m.html.length,
          html: m.html,
        })),
      });
    }

    if (problems.length) {
      console.error("[telegram] message jaanch mein fail:", problems);
      return NextResponse.json(
        { error: "message theek nahi", problems },
        { status: 500 },
      );
    }
    if (messages.length === 0) {
      console.warn("[telegram] kuch bhejne ko nahi:", skipped);
      return NextResponse.json(
        { ok: false, sent: 0, skipped },
        { status: 503 },
      );
    }

    const result = await sendMessages(messages.map((m) => m.html));
    return NextResponse.json({ ok: true, ...result, skipped });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "pata nahi";
    console.error("[telegram] fail:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
