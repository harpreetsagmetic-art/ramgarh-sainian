import type { Locale } from "./i18n";

const BASE = "https://api.gurpurab.com/v1";

type L = { en?: string; pa?: string };

type NsDate = {
  day: number;
  month: number;
  year: number;
  monthName: { en: string; pa: string };
};

export type Holiday = {
  id: string;
  type: string; // "sangrand" | "puranmashi" | "massia" | "historical" | gurpurab types
  isGurpurab: boolean;
  importance?: number; // doc mein matlab nahi diya, hum sirf highlight ke liye use karte hain
  name: unknown; // teen alag shapes, neeche holidayName() sambhalta hai
  significance?: L;
  nanakshahi?: NsDate; // is holiday ki apni Nanakshahi tareekh
};

export type DayInfo = {
  gregorian: string; // "2026-11-24"
  nanakshahi: NsDate & { yearLabel?: string };
  holidays: Holiday[];
};

export type UpcomingItem = Holiday & { date: string };

export type Kind =
  | "gurpurab"
  | "festival"
  | "sangrand"
  | "puranmashi"
  | "massia"
  | "historical"
  | "other";

// Dono bhasha ke saath ek saaf item (client components ke liye)
export type CalItem = {
  key: string;
  date: string;
  kind: Kind;
  importance: number;
  name: { pa: string; en: string };
  text: { pa: string; en: string };
  ns: { pa: string; en: string }; // "9 ਮੱਘਰ"
  guru?: number; // 1 se 11
};

// India (IST) ki aaj ki date "YYYY-MM-DD" mein
export const istDate = (offsetDays = 0) =>
  new Date(Date.now() + offsetDays * 86_400_000).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

// Ek din ki jaankari. Kuch bhi galat ho to null, site crash nahi hogi.
export async function getDay(iso: string): Promise<DayInfo | null> {
  try {
    const res = await fetch(`${BASE}/date/${iso}`, {
      next: { revalidate: 21600 },
    }); // 6 ghante
    if (!res.ok) return null;
    const j = await res.json();
    if (!j || !Array.isArray(j.holidays) || !j.nanakshahi) return null;
    return j as DayInfo;
  } catch {
    return null;
  }
}

// Calendar ka data kis tareekh tak loaded hai
export async function getMeta(): Promise<{ loadedThrough: string } | null> {
  try {
    const res = await fetch(`${BASE}/meta`, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const j = await res.json();
    const t = j?.calendar?.loadedThrough;
    return typeof t === "string" ? { loadedThrough: t } : null;
  } catch {
    return null;
  }
}

// Aaj se agle `days` din (data ki akhri tareekh ke baad ke din chhod dete hain)
export async function getRange(days: number): Promise<DayInfo[]> {
  const meta = await getMeta();
  const last = meta?.loadedThrough;
  const dates = Array.from({ length: days }, (_, i) => istDate(i)).filter(
    (d) => !last || d <= last,
  );
  const res = await Promise.all(dates.map((d) => getDay(d)));
  return res.filter((d): d is DayInfo => d !== null);
}

// Agle `days` din ke saare dihare (historical ko chhodkar)
export async function getUpcoming(days = 31): Promise<UpcomingItem[]> {
  const range = await getRange(days);
  const out: UpcomingItem[] = [];
  for (const d of range) {
    for (const h of d.holidays) {
      if (kindOf(h) !== "historical") out.push({ ...h, date: d.gregorian });
    }
  }
  return out;
}

// ---------- naam aur type ke helpers ----------
function txt(v: unknown, l: Locale): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  const o = v as L;
  return o[l] ?? o.en ?? "";
}

type NameShape = {
  guru?: unknown;
  gurpurab?: unknown;
  person?: unknown;
  event?: unknown;
};

export function holidayName(h: Holiday, l: Locale): string {
  const n = (h.name ?? {}) as NameShape;
  if (n.guru && n.gurpurab) return `${txt(n.guru, l)} – ${txt(n.gurpurab, l)}`;
  if (n.person && n.event) return `${txt(n.person, l)} – ${txt(n.event, l)}`;
  return txt(h.name, l); // sangrand / massia / puranmashi: seedha naam
}

export const significance = (h: Holiday, l: Locale) =>
  h.significance?.[l] ?? h.significance?.en ?? "";

// Guru wale dihare mein name.guru.number (1 se 11)
export function guruNumber(h: Holiday): number | undefined {
  const g = ((h.name ?? {}) as NameShape).guru as
    | { number?: number }
    | undefined;
  return typeof g?.number === "number" ? g.number : undefined;
}

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
          pa: `${ns.day} ${ns.monthName.pa}`,
          en: `${ns.day} ${ns.monthName.en}`,
        },
        guru: guruNumber(h),
      });
    });
  }
  return out.sort(
    (a, b) => a.date.localeCompare(b.date) || a.importance - b.importance,
  );
}

// ---------- tareekh dikhane ke helpers ----------
export function fmtDay(iso: string, l: Locale) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(
    l === "pa" ? "pa-IN" : "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    },
  );
}

export function fmtFull(iso: string, l: Locale) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(
    l === "pa" ? "pa-IN" : "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  );
}
