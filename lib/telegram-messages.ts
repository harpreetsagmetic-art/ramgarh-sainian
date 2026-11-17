// Telegram ke liye message: roz ka digest aur Hukamnama.
// Format WhatsApp ka hai (*bold*, _italic_). Kam se kam messages, aur har message itna chhota
// ki copy karke WhatsApp mein paste karne par "Read more" na aaye.
// Sab kuch Punjabi mein; dihare ke naam ke neeche English bhi (SHOW_ENGLISH se band kar sakte ho).

import { geo } from "./content";
import { istDate, toItems, type CalItem, type Kind } from "./gurpurab";
import { guruNote } from "./gurus";
import { loadHukamnama } from "./hukamnama";
import { getDay } from "./jantri";
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
const SHOW_ENGLISH = true; // dihare ke naam ke neeche English
const HUKAM_ENGLISH = false; // Hukamnama mein English meaning bhi chahiye? true karo (message badh jayenge)

// Ek message ki lambai (akshar). WhatsApp "Read more" ki exact hadd khud nahi batata.
// Apne phone par test karke sabse bada size dhundo jahan "Read more" nahi aata,
// phir Vercel env WA_MSG_LIMIT mein wahi daalo. Jitna bada, utne kam message.
const LIMIT =
  Number(process.env.WA_MSG_LIMIT) > 0 ? Number(process.env.WA_MSG_LIMIT) : 600;

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

// Data ke andar * _ ~ ` aaye to WhatsApp ki formatting toot jaati hai, isliye hata dete hain.
// (Gurbani ke tuk par ye kabhi nahi lagta: wo bina badle jaata hai.)
const clean = (s: string) => s.replace(/[*_~`]/g, "").trim();

// Blocks ko messages mein bharna: jitne LIMIT mein aa sakein, ek message mein.
// Ek block kabhi beech se nahi tootta (jab tak wo akela hi LIMIT se bada na ho).
//   head: pehle message ke shuru mein    foot: aakhri message ke ant mein
//   sep: blocks ke beech    headSep: head aur blocks ke beech
function pack(
  blocks: string[],
  opts: {
    head?: string;
    foot?: string;
    sep?: string;
    headSep?: string;
    limit?: number;
  } = {},
): string[] {
  const {
    head = "",
    foot = "",
    sep = "\n",
    headSep = "\n\n",
    limit = LIMIT,
  } = opts;
  const out: string[] = [];
  let cur: string[] = [];
  let first = true;
  const render = (arr: string[]) =>
    (first && head ? head + headSep : "") + arr.join(sep);

  for (const b of blocks) {
    if (cur.length && render([...cur, b]).length > limit) {
      out.push(render(cur));
      first = false;
      cur = [];
    }
    cur.push(b);
  }
  if (cur.length) out.push(render(cur));
  else if (head) out.push(head);

  if (foot) {
    const last = out.length ? out[out.length - 1] : "";
    if (last && (last + "\n\n" + foot).length <= limit)
      out[out.length - 1] = last + "\n\n" + foot;
    else out.push(foot);
  }
  return out;
}

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
  const est = i.estimated ? " _(ਅੰਦਾਜ਼ਨ)_" : "";
  const en =
    SHOW_ENGLISH && i.name.en && i.name.en !== i.name.pa
      ? `\n_${clean(i.name.en)}_`
      : "";
  return `${icon(i)} *${clean(i.name.pa)}*${est}${en}`;
}

// Guru sahiban wale dihare par chhota parichay
function guruBlock(items: CalItem[]): string[] {
  const it = items.find((i) => i.guru && i.kind === "gurpurab");
  const n = it ? guruNote(it.guru, "pa") : null;
  if (!n) return [];
  const sentences = (n.text.match(/[^।.!?]+[।.!?]*/g) ?? [n.text])
    .map((s) => clean(s))
    .filter(Boolean);
  return pack(sentences, {
    head: `📖 *${clean(n.title)}* (${clean(n.years)})`,
    headSep: "\n",
    sep: " ",
  });
}

async function weatherBlock(): Promise<string> {
  try {
    const w = await getWeather(geo.lat, geo.lon);
    if (!w) return "";
    const c = w.current;
    const d0 = w.days[0];
    const info = weatherInfo(c.code, c.isDay);

    const lines = [
      `${info.emoji} *ਮੌਸਮ* · ${clean(info.text.pa)}`,
      `🌡 ${Math.round(c.temp)}°C (ਮਹਿਸੂਸ ${Math.round(c.feels)}°) · ਅੱਜ ${Math.round(d0.min)}°–${Math.round(d0.max)}°`,
      `🌧 ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${Math.round(d0.rainProb)}% · 💨 ਹਵਾ ${Math.round(c.wind)} km/h`,
    ];
    if (w.aqi) {
      lines.push(
        `😷 ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ: AQI ${Math.round(w.aqi.us)} · ${clean(aqiInfo(w.aqi.us).label.pa)}`,
      );
    }
    lines.push(`🌅 ${fmtClock(d0.sunrise)} · 🌇 ${fmtClock(d0.sunset)}`);
    for (const a of buildAlerts(w).slice(0, 2))
      lines.push(`⚠️ ${clean(a.text.pa)}`);
    return lines.join("\n");
  } catch {
    // Mausam na mile to baaki digest phir bhi jaye
    return "";
  }
}

// ---------- 1) Roz ka digest ----------
// Group: aaj (tareekh + dihare + Guru parichay), kal ka yaad patra, itihaas, mausam + link.
// Har group ek saath rehta hai; chhote groups ek hi message mein jud jaate hain (jitna LIMIT de).
export async function buildDigest(todayIso = istDate(0)): Promise<string[]> {
  const tomorrowIso = addDays(todayIso, 1);
  const [d0, d1] = await Promise.all([getDay(todayIso), getDay(tomorrowIso)]);

  const todayAll = d0 ? toItems([d0]) : [];
  const todayEvents = todayAll.filter((i) => i.kind !== "historical");
  const todayHistory = todayAll.filter((i) => i.kind === "historical");
  const tomorrowAll = d1 ? toItems([d1]) : [];

  const groups: string[][] = [];

  // Aaj
  const ns = d0?.nanakshahi;
  const head = [
    `🙏 *ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ*`,
    `*ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ* · ਅੱਜ ਦੀ ਜਾਣਕਾਰੀ`,
    ``,
    `📅 *${pa(todayIso)}*` +
      (ns
        ? `\n🗓 ਨਾਨਕਸ਼ਾਹੀ ਸੰਮਤ ${ns.year} · *${ns.day} ${clean(ns.monthName.pa)}*`
        : ""),
    ``,
    `🔔 *ਅੱਜ ਦੇ ਦਿਹਾੜੇ*`,
  ].join("\n");
  const todayBlocks = pack(
    todayEvents.length
      ? todayEvents.map(eventLine)
      : ["_ਅੱਜ ਕੋਈ ਖ਼ਾਸ ਦਿਹਾੜਾ ਨਹੀਂ ਹੈ।_"],
    {
      head,
      headSep: "\n",
    },
  );
  groups.push([...todayBlocks, ...guruBlock(todayEvents)]);

  // Kal ka dihara (ek din pehle yaad patra)
  if (tomorrowAll.length) {
    const tEvents = tomorrowAll.filter((i) => i.kind !== "historical");
    const tHistory = tomorrowAll.filter((i) => i.kind === "historical");
    const tBlocks = pack([...tEvents, ...tHistory].map(eventLine), {
      head: `⏰ *ਕੱਲ੍ਹ ਲਈ ਯਾਦ ਪੱਤਰ*\n_${pa(tomorrowIso, false)}_`,
      headSep: "\n",
    });
    groups.push([...tBlocks, ...guruBlock(tEvents)]);
  }

  // Aaj ka itihaas (na ho to agle 7 din ka)
  if (todayHistory.length) {
    groups.push(
      pack(todayHistory.map(eventLine), {
        head: `📜 *ਅੱਜ ਦਾ ਇਤਿਹਾਸ*`,
        headSep: "\n",
      }),
    );
  } else {
    const soon: string[] = [];
    const days = await Promise.all(
      Array.from({ length: 7 }, (_, i) => getDay(addDays(todayIso, i + 1))),
    );
    for (const d of days) {
      if (!d) continue;
      for (const i of toItems([d]).filter((x) => x.kind === "historical")) {
        soon.push(`• _${pa(d.gregorian, false)}_ — ${clean(i.name.pa)}`);
      }
    }
    if (soon.length) {
      groups.push(
        pack(soon.slice(0, 5), {
          head: `📜 *ਆਉਣ ਵਾਲੇ ਦਿਨਾਂ ਦਾ ਇਤਿਹਾਸ*`,
          headSep: "\n",
        }),
      );
    }
  }

  // Mausam + link
  const wb = await weatherBlock();
  const links =
    `🌐 ਵੈੱਬਸਾਈਟ: ${SITE}/pa\n` +
    `🔴 ਲਾਈਵ ਕੀਰਤਨ: ${SITE}/pa/live\n` +
    `🗓 ਕੈਲੰਡਰ: ${SITE}/pa/calendar\n\n` +
    `_ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖ਼ਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਿਹ_ 🙏`;
  groups.push(pack([wb, links].filter(Boolean), { sep: "\n\n" }));

  // Har group pehle apne andar ek message mein jodo, phir groups ko LIMIT tak ek saath bharo
  const units = groups.flatMap((g) => pack(g, { sep: "\n\n" }));
  return pack(units, { sep: "\n\n" });
}

// ---------- 2) Aaj ka Hukamnama ----------
// Har tuk ke saath uska arth: message apne aap mein poora rehta hai.
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

  const head = [
    `🙏 *ਅੱਜ ਦਾ ਹੁਕਮਨਾਮਾ*`,
    `ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ, ਅੰਮ੍ਰਿਤਸਰ`,
    `📖 ਅੰਗ *${h.pageNo}*` +
      (h.raag.pa ? ` · ${clean(h.raag.pa)}` : "") +
      (h.writer ? ` · ${clean(h.writer)}` : ""),
    `📅 ${pa(h.date)}`,
  ].join("\n");

  const foot = `🙏 _ਸਤਿਕਾਰ ਸਹਿਤ ਪੜ੍ਹੋ ਜੀ_ · ਸਰੋਤ: BaniDB`;

  // Gurbani bina badle (v.gurmukhi), uske neeche arth italic mein. Tuk aur uska arth kabhi alag nahi hote.
  const blocks = h.verses.map((v) => {
    const lines = [v.gurmukhi];
    if (v.punjabi) lines.push(`_${clean(v.punjabi)}_`);
    if (HUKAM_ENGLISH && v.english) lines.push(`_${clean(v.english)}_`);
    return lines.join("\n");
  });

  return {
    messages: pack(blocks, { head, foot, sep: "\n\n", headSep: "\n\n" }),
  };
}
