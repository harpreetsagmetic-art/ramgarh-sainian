import type { Locale } from "./i18n";

const BASE = "https://api.gurpurab.com/v1";

type L = { en?: string; pa?: string };

export type Holiday = {
  id: string;
  type: string; // "sangrand" | "puranmashi" | "massia" | "historical" | gurpurab types
  isGurpurab: boolean;
  importance?: number;
  name: unknown; // teen alag shapes ho sakti hain, neeche holidayName() sambhalta hai
  significance?: L;
};

export type DayInfo = {
  gregorian: string; // "2026-11-24"
  nanakshahi: {
    day: number;
    month: number;
    year: number;
    monthName: { en: string; pa: string };
  };
  holidays: Holiday[];
};

export type UpcomingItem = Holiday & { date: string };

// India (IST) ki aaj ki date "YYYY-MM-DD" mein. en-CA locale isi format mein deta hai.
export const istDate = (offsetDays = 0) =>
  new Date(Date.now() + offsetDays * 86_400_000).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

// Ek din ki jaankari. Kuch bhi galat ho to null, site crash nahi hogi.
export async function getDay(iso: string): Promise<DayInfo | null> {
  try {
    const res = await fetch(`${BASE}/date/${iso}`, { next: { revalidate: 21600 } }); // 6 ghante cache
    if (!res.ok) return null;
    const j = await res.json();
    if (!j || !Array.isArray(j.holidays) || !j.nanakshahi) return null;
    return j as DayInfo;
  } catch {
    return null;
  }
}

// Agle `days` din ke saare dihare (historical ko chhodkar)
export async function getUpcoming(days = 31): Promise<UpcomingItem[]> {
  const results = await Promise.all(Array.from({ length: days }, (_, i) => getDay(istDate(i))));
  const out: UpcomingItem[] = [];
  for (const d of results) {
    if (!d) continue;
    for (const h of d.holidays) {
      if (h.type !== "historical") out.push({ ...h, date: d.gregorian });
    }
  }
  return out;
}

// ---------- naam nikalne ke helpers ----------
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
  return txt(h.name, l); // sangrand / massia / puranmashi: seedha naam
}

export const significance = (h: Holiday, l: Locale) =>
  h.significance?.[l] ?? h.significance?.en ?? "";

export function fmtDay(iso: string, l: Locale) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(l === "pa" ? "pa-IN" : "en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}