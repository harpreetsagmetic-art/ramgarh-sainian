export type HukamVerse = { id: number; gurmukhi: string; punjabi?: string; english?: string };

export type Hukamnama = {
  pageNo: number;
  raag: { pa: string; en: string };
  writer: string;
  verses: HukamVerse[];
};

type RawVerse = {
  verseId: number;
  verse: { unicode: string };
  translation?: {
    pu?: { ss?: { unicode?: string | null }; ms?: { unicode?: string | null } };
    en?: { bdb?: string; ssk?: string; ms?: string };
  };
};

export async function getHukamnama(): Promise<Hukamnama | null> {
  try {
    const res = await fetch("https://api.banidb.com/v2/hukamnamas/today", {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const j = await res.json();

    const shabad = j?.shabads?.[0];
    if (!shabad?.verses?.length) return null;

    const info = shabad.shabadInfo;
    return {
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