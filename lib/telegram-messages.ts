// Telegram ke liye sajaye hue (HTML) message: roz ka digest aur Hukamnama.
// Sab kuch Punjabi mein; dihare ke naam ke neeche English bhi (SHOW_ENGLISH se band kar sakte ho).

import { geo } from "./content";
import { istDate, toItems, type CalItem, type Kind } from "./gurpurab";
import { guruNote } from "./gurus";
import { loadHukamnama } from "./hukamnama";
import { getDay } from "./jantri";
import { esc } from "./telegram";
import {
    aqiInfo,
    buildAlerts,
    fmtClock,
    getWeather,
    weatherInfo,
} from "./weather";

const SITE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ramgarhsainian.site"
).replace(/\/$/, "");
const SHOW_ENGLISH = true;
const LIMIT = 3800; // Telegram ki hadd 4096 hai, thoda khula chhodte hain
const LINE = "━━━━━━━━━━━━━━";

const addDays = (iso: string, n: number) =>
  new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000)
    .toISOString()
    .slice(0, 10);

const pa = (iso: string, withYear = true) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("pa-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" as const } : {}),
    timeZone: "UTC",
  });

const ICON: Record<Kind, string> = {
  gurpurab: "🪔",
  festival: "🪔",
  sangrand: "☀️",
  puranmashi: "🌕",
  massia: "🌑",
  historical: "📜",
  other: "🔔",
};

const icon = (i: CalItem) =>
  i.kind === "historical" && /shaheed|ਸ਼ਹੀਦ/i.test(`${i.name.en} ${i.name.pa}`)
    ? "🕯"
    : ICON[i.kind];

function eventLine(i: CalItem): string {
  const est = i.estimated ? " <i>(ਅੰਦਾਜ਼ਨ)</i>" : "";
  const en =
    SHOW_ENGLISH && i.name.en && i.name.en !== i.name.pa
      ? `\n      <i>${esc(i.name.en)}</i>`
      : "";
  return `${icon(i)} <b>${esc(i.name.pa)}</b>${est}${en}`;
}

// Guru sahiban wale dihare par ek "kholne wala" chhota parichay
function guruBlock(items: CalItem[]): string {
  const it = items.find((i) => i.guru && i.kind === "gurpurab");
  const n = it ? guruNote(it.guru, "pa") : null;
  return n
    ? `<blockquote expandable><b>${esc(n.title)}</b> (${esc(n.years)})\n${esc(n.text)}</blockquote>`
    : "";
}

async function weatherBlock(): Promise<string> {
  const w = await getWeather(geo.lat, geo.lon);
  if (!w) return "";
  const c = w.current;
  const d0 = w.days[0];
  const info = weatherInfo(c.code, c.isDay);

  const lines = [
    `${info.emoji} <b>ਮੌਸਮ</b> · ${esc(info.text.pa)}`,
    `🌡 ${Math.round(c.temp)}°C (ਮਹਿਸੂਸ ${Math.round(c.feels)}°) · ਅੱਜ ${Math.round(d0.min)}°–${Math.round(d0.max)}°`,
    `🌧 ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${Math.round(d0.rainProb)}% · 💨 ਹਵਾ ${Math.round(c.wind)} km/h`,
  ];
  if (w.aqi) {
    lines.push(
      `😷 ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ: AQI ${Math.round(w.aqi.us)} · ${esc(aqiInfo(w.aqi.us).label.pa)}`,
    );
  }
  lines.push(`🌅 ${fmtClock(d0.sunrise)} · 🌇 ${fmtClock(d0.sunset)}`);
  for (const a of buildAlerts(w).slice(0, 2))
    lines.push(`⚠️ ${esc(a.text.pa)}`);
  return lines.join("\n");
}

// Lambe text ko Telegram ki hadd ke andar tukdon mein todna (har tukde mein khud ka band hone wala wrapper)
function chunk(lines: string[], wrap: (body: string) => string): string[] {
  const out: string[] = [];
  let cur: string[] = [];
  const size = (arr: string[]) => wrap(arr.join("\n\n")).length;
  for (const l of lines) {
    if (cur.length && size([...cur, l]) > LIMIT) {
      out.push(wrap(cur.join("\n\n")));
      cur = [];
    }
    cur.push(l);
  }
  if (cur.length) out.push(wrap(cur.join("\n\n")));
  return out;
}

// ---------- 1) Roz ka digest ----------
export async function buildDigest(todayIso = istDate(0)): Promise<string[]> {
  const tomorrowIso = addDays(todayIso, 1);
  const [d0, d1] = await Promise.all([getDay(todayIso), getDay(tomorrowIso)]);

  const todayAll = d0 ? toItems([d0]) : [];
  const todayEvents = todayAll.filter((i) => i.kind !== "historical");
  const todayHistory = todayAll.filter((i) => i.kind === "historical");
  const tomorrowAll = d1 ? toItems([d1]) : [];

  const out: string[] = [];
  out.push(
    `🌅 <b>ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ</b> 🙏\n<b>ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ</b> · ਅੱਜ ਦੀ ਜਾਣਕਾਰੀ\n${LINE}`,
  );

  // Aaj ki tareekh
  const ns = d0?.nanakshahi;
  out.push(
    `📅 <b>${esc(pa(todayIso))}</b>` +
      (ns
        ? `\n🗓 ਨਾਨਕਸ਼ਾਹੀ ਸੰਮਤ ${ns.year} · <b>${ns.day} ${esc(ns.monthName.pa)}</b>`
        : ""),
  );

  // Aaj ke dihare
  out.push(
    `🔔 <b>ਅੱਜ ਦੇ ਦਿਹਾੜੇ</b>\n` +
      (todayEvents.length
        ? todayEvents.map(eventLine).join("\n")
        : "<i>ਅੱਜ ਕੋਈ ਖ਼ਾਸ ਦਿਹਾੜਾ ਨਹੀਂ ਹੈ।</i>") +
      (guruBlock(todayEvents) ? `\n${guruBlock(todayEvents)}` : ""),
  );

  // Kal ka dihara (ek din pehle yaad patra)
  if (tomorrowAll.length) {
    const tEvents = tomorrowAll.filter((i) => i.kind !== "historical");
    const tHistory = tomorrowAll.filter((i) => i.kind === "historical");
    out.push(
      `${LINE}\n⏰ <b>ਕੱਲ੍ਹ ਲਈ ਯਾਦ ਪੱਤਰ</b>\n<i>${esc(pa(tomorrowIso, false))}</i>\n` +
        [...tEvents.map(eventLine), ...tHistory.map(eventLine)].join("\n") +
        (guruBlock(tEvents) ? `\n${guruBlock(tEvents)}` : ""),
    );
  }

  // Aaj ka itihaas (na ho to agle 7 din ka)
  if (todayHistory.length) {
    out.push(
      `${LINE}\n📜 <b>ਅੱਜ ਦਾ ਇਤਿਹਾਸ</b>\n${todayHistory.map(eventLine).join("\n")}`,
    );
  } else {
    const soon: string[] = [];
    const days = await Promise.all(
      Array.from({ length: 7 }, (_, i) => getDay(addDays(todayIso, i + 1))),
    );
    for (const d of days) {
      if (!d) continue;
      for (const i of toItems([d]).filter((x) => x.kind === "historical")) {
        soon.push(
          `• <i>${esc(pa(d.gregorian, false))}</i> — ${esc(i.name.pa)}`,
        );
      }
    }
    if (soon.length)
      out.push(
        `${LINE}\n📜 <b>ਆਉਣ ਵਾਲੇ ਦਿਨਾਂ ਦਾ ਇਤਿਹਾਸ</b>\n${soon.slice(0, 5).join("\n")}`,
      );
  }

  // Mausam
  const wb = await weatherBlock();
  if (wb) out.push(`${LINE}\n${wb}`);

  // Neeche ke link
  out.push(
    `${LINE}\n🌐 <a href="${SITE}/pa">ਵੈੱਬਸਾਈਟ</a> · 🔴 <a href="${SITE}/pa/live">ਲਾਈਵ ਕੀਰਤਨ</a> · 🗓 <a href="${SITE}/pa/calendar">ਕੈਲੰਡਰ</a>\n` +
      `<i>ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਿਹ</i> 🙏`,
  );

  // Ek hi message mein jitna aa jaye (fir naya message)
  return chunk(out, (b) => b);
}

// ---------- 2) Aaj ka Hukamnama ----------
export async function buildHukamnama(
  force = false,
): Promise<{ messages: string[]; reason?: string }> {
  const r = await loadHukamnama();
  if (!r.data) return { messages: [], reason: "Hukamnama API se nahi mila" };
  if (!r.isCurrent && !force) {
    return {
      messages: [],
      reason: `Aaj ka Hukamnama abhi nahi aaya (API ki date ${r.data.date})`,
    };
  }
  const h = r.data;

  const head =
    `🙏 <b>ਅੱਜ ਦਾ ਹੁਕਮਨਾਮਾ</b>\nਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ, ਅੰਮ੍ਰਿਤਸਰ\n${LINE}\n` +
    `📖 ਅੰਗ <b>${h.pageNo}</b>` +
    (h.raag.pa ? ` · ${esc(h.raag.pa)}` : "") +
    (h.writer ? ` · ${esc(h.writer)}` : "") +
    `\n📅 ${esc(pa(h.date))}`;

  const foot = `${LINE}\n🙏 <i>ਸਤਿਕਾਰ ਸਹਿਤ ਪੜ੍ਹੋ ਜੀ</i> · ਸਰੋਤ: BaniDB`;

  // Gurbani bina badle, jaisi API se aayi (har tuk nayi line par)
  const gurbani = chunk(
    h.verses.map((v) => esc(v.gurmukhi)),
    (b) => `<blockquote>${b.replace(/\n\n/g, "\n")}</blockquote>`,
  );

  const messages: string[] = gurbani.map((g, i) =>
    i === 0 ? `${head}\n\n${g}\n\n${foot}` : g,
  );

  // Arth (kholne wale dibbe: pehle band, chhoone par khulte hain)
  const arth = h.verses
    .map((v) => v.punjabi)
    .filter((x): x is string => !!x)
    .map(esc);
  const eng = h.verses
    .map((v) => v.english)
    .filter((x): x is string => !!x)
    .map(esc);

  for (const [title, lines] of [
    ["📖 <b>ਅਰਥ</b>", arth],
    ["🌐 <b>English meaning</b>", eng],
  ] as const) {
    if (lines.length === 0) continue;
    messages.push(
      ...chunk(
        lines,
        (b) =>
          `${title}\n<blockquote expandable>${b.replace(/\n\n/g, "\n\n")}</blockquote>`,
      ),
    );
  }

  return { messages };
}
