import { hukamDay, secondsUntilIst } from "./ist";

export type HukamVerse = { id: number; gurmukhi: string; punjabi?: string; english?: string };

export type Hukamnama = {
  date: string; // "YYYY-MM-DD", API ke response se
  pageNo: number;
  raag: { pa: string; en: string };
  writer: string;
  verses: HukamVerse[];
};

export type HukamnamaResult = {
  data: Hukamnama | null;
  isCurrent: boolean; // kya ye abhi ka asli Hukamnama hai
  ttl: number;        // CDN ko kitne second cache karna hai
};

type RawVerse = {
  verseId: number;
  verse: { unicode: string };
  translation?: {
    pu?: { ss?: { unicode?: string | null }; ms?: { unicode?: string | null } };
    en?: { bdb?: string; ssk?: string; ms?: string };
  };
};

// Seedha BaniDB se, bina Next ke cache ke (cache ka faisla neeche hum khud karte hain)
async function fetchUpstream(): Promise<Hukamnama | null> {
  try {
    const res = await fetch("https://api.banidb.com/v2/hukamnamas/today", { cache: "no-store" });
    if (!res.ok) return null;
    const j = await res.json();

    const shabad = j?.shabads?.[0];
    if (!shabad?.verses?.length) return null;

    const g = j?.date?.gregorian;
    const date = g
      ? `${g.year}-${String(g.month).padStart(2, "0")}-${String(g.date).padStart(2, "0")}`
      : "";

    const info = shabad.shabadInfo;
    return {
      date,
      pageNo: info.pageNo,
      raag: { pa: info.raag?.unicode ?? "", en: info.raag?.english ?? "" },
      writer: info.writer?.english ?? "",
      verses: (shabad.verses as RawVerse[]).map((v) => ({
        id: v.verseId,
        gurmukhi: v.verse.unicode, // bina badle, jaisa API ne diya
        punjabi: v.translation?.pu?.ss?.unicode ?? v.translation?.pu?.ms?.unicode ?? undefined,
        english: v.translation?.en?.bdb ?? v.translation?.en?.ssk ?? v.translation?.en?.ms,
      })),
    };
  } catch {
    return null;
  }
}

// Is server instance ki yaaddasht (CDN ke peeche doosri layer)
let memo: { day: string; expires: number; value: HukamnamaResult } | null = null;

export async function loadHukamnama(): Promise<HukamnamaResult> {
  const expected = hukamDay();

  if (memo && memo.day === expected && memo.expires > Date.now()) {
    const left = Math.max(60, Math.ceil((memo.expires - Date.now()) / 1000));
    return { ...memo.value, ttl: left };
  }

  const data = await fetchUpstream();
  const isCurrent = !!data && data.date >= expected; // ISO dates string se bhi sahi compare hoti hain
  const ttl = !data ? 60 : isCurrent ? secondsUntilIst(4) : 300;

  console.log("[hukamnama]", { expected, got: data?.date ?? null, isCurrent, ttl });

  const value: HukamnamaResult = { data, isCurrent, ttl };
  memo = { day: expected, expires: Date.now() + ttl * 1000, value };
  return value;
}