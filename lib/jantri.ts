// Sikh calendar ka data (sirf server par).
//
// Data lib/jantri-data.json se aata hai, jo `npm run jantri:build` banata hai (scripts/build-jantri.mjs).
//   - NS 558 (2026-27): "confirmed" - official Nanakshahi 558 wall-poster calendar se pinned
//   - NS 559 aur aage: "estimated" - gananaa se nikali tareekhein, chhapi Jantri aane par pakki hongi
// Koi network call nahi, isliye ye kabhi "band" nahi hota.

import type { DayInfo, Holiday, NsDate, Status, UpcomingItem } from "./gurpurab";
import { istDate } from "./gurpurab";
import raw from "./jantri-data.json";

type EventRec = { id: string; en: string; pa: string; category: string; span: number; date: string; status: Status };
type MonthRec = { name: string; start: string; days: number };
type YearRec = {
  nsYear: number;
  status: Status;
  source: string;
  start: string;
  nextChet: string;
  months: MonthRec[];
  events: EventRec[];
  massia: string[];
  purnmashi: string[];
  lunarStatus: Status;
};
type Data = { generatedAt: string; packageName: string; packageVersion: string; years: Record<string, YearRec> };

const data = raw as unknown as Data;
const years = Object.values(data.years).sort((a, b) => a.nsYear - b.nsYear);

const MONTHS_PA: Record<string, string> = {
  Chet: "ਚੇਤ", Vaisakh: "ਵੈਸਾਖ", Jeth: "ਜੇਠ", Harh: "ਹਾੜ", Sawan: "ਸਾਵਣ", Bhadon: "ਭਾਦੋਂ",
  Assu: "ਅੱਸੂ", Katak: "ਕੱਤਕ", Maghar: "ਮੱਘਰ", Poh: "ਪੋਹ", Magh: "ਮਾਘ", Phagan: "ਫੱਗਣ",
};

const addDaysIso = (iso: string, n: number) =>
  new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

// Guru sahiban: event ke id se number (1 se 11)
const GURU_ID: [string, number][] = [
  ["guru-nanak", 1], ["guru-angad", 2], ["guru-amardas", 3], ["guru-ramdas", 4], ["guru-arjan", 5],
  ["guru-hargobind", 6], ["guru-har-rai", 7], ["guru-harkrishan", 8], ["guru-tegh-bahadur", 9],
  ["guru-gobind-singh", 10], ["guru-granth", 11],
];

function guruOf(ev: EventRec): number | undefined {
  if (ev.id === "miri-piri-divas") return 6;
  if (ev.id === "khalsa-sajna-divas") return 10;
  if (ev.category !== "gurpurab") return undefined;
  return GURU_ID.find(([k]) => ev.id.includes(k))?.[1];
}

// Dihare ka "vajan" (home par star ke liye). 1 = sabse bade.
function importanceOf(ev: EventRec): number {
  if (/^(parkash|pehla-parkash)-/.test(ev.id) || ev.id === "khalsa-sajna-divas") return 1;
  if (/^shaheedi-guru-/.test(ev.id)) return 1;
  if (/bandi chhor|hola mohalla/i.test(ev.en)) return 1;
  return ev.category === "gurpurab" ? 2 : 3;
}

// ---------- Tareekh se Nanakshahi tareekh ----------
function yearOf(iso: string): YearRec | null {
  return years.find((y) => iso >= y.start && iso < y.nextChet) ?? null;
}

function nsOf(iso: string, y: YearRec): NsDate {
  let m = y.months[0];
  for (const cur of y.months) if (cur.start <= iso) m = cur;
  const day = Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${m.start}T00:00:00Z`)) / 86_400_000) + 1;
  return {
    day,
    month: y.months.indexOf(m) + 1,
    year: y.nsYear,
    monthName: { en: m.name, pa: MONTHS_PA[m.name] ?? m.name },
  };
}

// ---------- Din-wise index (ek baar banta hai) ----------
type Entry = { holiday: Holiday };
const byDate = new Map<string, Entry[]>();
const put = (date: string, holiday: Holiday) => {
  const list = byDate.get(date);
  if (list) list.push({ holiday });
  else byDate.set(date, [{ holiday }]);
};

for (const y of years) {
  // Sangrand = har Nanakshahi mahine ka pehla din
  for (const m of y.months) {
    const pa = MONTHS_PA[m.name] ?? m.name;
    put(m.start, {
      id: `sangrand-${m.name.toLowerCase()}-${y.nsYear}`,
      type: "sangrand",
      isGurpurab: false,
      importance: 2,
      name: { en: `${m.name} Sangrand`, pa: `${pa} ਦੀ ਸੰਗਰਾਂਦ` },
      status: y.status,
    });
  }

  // Massia aur Puranmashi (mahine ka naam wahi jo us din chal raha ho)
  for (const [list, type, en, pa] of [
    [y.massia, "massia", "Massia", "ਮੱਸਿਆ"],
    [y.purnmashi, "puranmashi", "Puranmashi", "ਪੂਰਨਮਾਸ਼ੀ"],
  ] as const) {
    for (const iso of list) {
      const ns = nsOf(iso, y);
      put(iso, {
        id: `${type}-${iso}`,
        type,
        isGurpurab: false,
        importance: 3,
        name: { en: `${ns.monthName.en} ${en}`, pa: `${ns.monthName.pa} ਦੀ ${pa}` },
        status: y.lunarStatus,
      });
    }
  }

  // Gurpurab, itihaasik, civil, bhagat dihare (kuch kai din ke hote hain: span)
  for (const ev of y.events) {
    for (let i = 0; i < Math.max(1, ev.span); i++) {
      put(addDaysIso(ev.date, i), {
        id: ev.id,
        type: ev.category,
        isGurpurab: ev.category === "gurpurab",
        importance: importanceOf(ev),
        name: { en: ev.en, pa: ev.pa },
        guru: guruOf(ev),
        status: ev.status,
      });
    }
  }
}

// ---------- Bahar ke liye (purani API jaise hi naam) ----------
function dayInfo(iso: string): DayInfo | null {
  const y = yearOf(iso);
  if (!y) return null;
  const ns = nsOf(iso, y);
  const holidays = (byDate.get(iso) ?? []).map((e) => ({ ...e.holiday, nanakshahi: ns }));
  holidays.sort((a, b) => (a.importance ?? 3) - (b.importance ?? 3));
  return { gregorian: iso, nanakshahi: ns, holidays };
}

export async function getDay(iso: string): Promise<DayInfo | null> {
  return dayInfo(iso);
}

// Aaj se agle `days` din
export async function getRange(days: number): Promise<DayInfo[]> {
  return Array.from({ length: days }, (_, i) => dayInfo(istDate(i))).filter((d): d is DayInfo => d !== null);
}

// Agle `days` din ke saare dihare (itihaas wale dinon ko chhodkar)
export async function getUpcoming(days = 31): Promise<UpcomingItem[]> {
  const out: UpcomingItem[] = [];
  for (const d of await getRange(days)) {
    for (const h of d.holidays) if (h.type !== "historical") out.push({ ...h, date: d.gregorian });
  }
  return out;
}

// Chhapi Jantri se pakki tareekhein kab tak hain, aur data kahan se aaya
export async function getMeta(): Promise<{
  loadedThrough: string;
  source: string;
  packageName: string;
  packageVersion: string;
  generatedAt: string;
} | null> {
  const confirmed = years.filter((y) => y.status === "confirmed");
  const last = confirmed[confirmed.length - 1];
  if (!last) return null;
  return {
    loadedThrough: addDaysIso(last.nextChet, -1),
    source: last.source,
    packageName: data.packageName,
    packageVersion: data.packageVersion,
    generatedAt: data.generatedAt,
  };
}