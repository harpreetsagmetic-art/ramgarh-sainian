// Calendar ke "shuddh" helpers: types, naam, kism, tareekh dikhana.
// Is file mein koi data import nahi hai, isliye client components ise bina bojh ke use kar sakte hain.
// Asli data lib/jantri.ts (sirf server) se aata hai.

import type { Locale } from "./i18n";

type L = { en?: string; pa?: string };

export type NsDate = {
  day: number;
  month: number;
  year: number;
  monthName: { en: string; pa: string };
};

export type Status = "confirmed" | "estimated";

export type Holiday = {
  id: string;
  type: string; // "sangrand" | "puranmashi" | "massia" | "gurpurab" | "historical" | "civil" | "bhagat"
  isGurpurab: boolean;
  importance?: number; // 1 sabse bada (ghar ke hisaab se: Parkash, Vaisakhi, Shaheedi, Bandi Chhor ...)
  name: unknown; // { en, pa } ya purani shape (guru/gurpurab/person/event), holidayName() sambhalta hai
  significance?: L;
  nanakshahi?: NsDate; // is dihare ki apni Nanakshahi tareekh
  guru?: number; // 1 se 11 (Guru sahiban wale dihare par)
  status?: Status; // "estimated" = gananaa se nikali tareekh, chhapi Jantri se pakki nahi
};

export type DayInfo = {
  gregorian: string; // "2026-11-24"
  nanakshahi: NsDate;
  holidays: Holiday[];
};

export type UpcomingItem = Holiday & { date: string };

export type Kind = "gurpurab" | "festival" | "sangrand" | "puranmashi" | "massia" | "historical" | "other";

// Dono bhasha wala saaf item (client components ke liye)
export type CalItem = {
  key: string;
  date: string;
  kind: Kind;
  importance: number;
  name: { pa: string; en: string };
  text: { pa: string; en: string };
  ns: { pa: string; en: string }; // "9 ਮੱਘਰ"
  guru?: number;
  estimated?: boolean;
};

// India (IST) ki aaj ki date "YYYY-MM-DD" mein
export const istDate = (offsetDays = 0) =>
  new Date(Date.now() + offsetDays * 86_400_000).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

// ---------- naam aur kism ----------
function txt(v: unknown, l: Locale): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  const o = v as L;
  return o[l] ?? o.en ?? "";
}

type NameShape = { guru?: unknown; gurpurab?: unknown; person?: unknown; event?: unknown };

export function holidayName(h: Holiday, l: Locale): string {
  const n = (h.name ?? {}) as NameShape;
  if (n.guru && n.gurpurab) return `${txt(n.guru, l)} – ${txt(n.gurpurab, l)}`;
  if (n.person && n.event) return `${txt(n.person, l)} – ${txt(n.event, l)}`;
  return txt(h.name, l); // { en, pa } wali seedhi shape
}

export const significance = (h: Holiday, l: Locale) => h.significance?.[l] ?? h.significance?.en ?? "";

export function guruNumber(h: Holiday): number | undefined {
  if (typeof h.guru === "number") return h.guru;
  const g = ((h.name ?? {}) as NameShape).guru as { number?: number } | undefined;
  return typeof g?.number === "number" ? g.number : undefined;
}

// Jo dihare "historical" likhe hain par asal mein tyohaar hain
const FESTIVAL_WORDS = [
  "bandi chhor", "bandi chor", "bandhi chhor", "bandi chhod",
  "hola mohalla", "vaisakhi",
  "ਬੰਦੀ ਛੋੜ", "ਬੰਦੀਛੋੜ", "ਹੋਲਾ ਮਹੱਲਾ", "ਵਿਸਾਖੀ",
];

function isFestival(h: Holiday): boolean {
  const hay = `${holidayName(h, "en")} ${holidayName(h, "pa")}`.toLowerCase();
  return FESTIVAL_WORDS.some((w) => hay.includes(w));
}

export function kindOf(h: Holiday): Kind {
  if (h.type === "sangrand" || h.type === "puranmashi" || h.type === "massia") return h.type;
  if (h.type === "historical") return isFestival(h) ? "festival" : "historical";
  return h.isGurpurab ? "gurpurab" : "other";
}

// DayInfo ki list ko saaf, dono bhasha wale items mein badalna
export function toItems(days: DayInfo[]): CalItem[] {
  const out: CalItem[] = [];
  for (const d of days) {
    d.holidays.forEach((h, i) => {
      const ns = h.nanakshahi ?? d.nanakshahi;
      out.push({
        key: `${d.gregorian}-${h.id}-${i}`,
        date: d.gregorian,
        kind: kindOf(h),
        importance: h.importance ?? 3,
        name: { pa: holidayName(h, "pa"), en: holidayName(h, "en") },
        text: { pa: significance(h, "pa"), en: significance(h, "en") },
        ns: {
          pa: `${ns?.day ?? ""} ${ns?.monthName?.pa ?? ""}`.trim(),
          en: `${ns?.day ?? ""} ${ns?.monthName?.en ?? ""}`.trim(),
        },
        guru: guruNumber(h),
        estimated: h.status === "estimated",
      });
    });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.importance - b.importance);
}

// ---------- tareekh dikhane ke helpers ----------
export function fmtDay(iso: string, l: Locale) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(l === "pa" ? "pa-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export function fmtFull(iso: string, l: Locale) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(l === "pa" ? "pa-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}