import type { Locale } from "./i18n";

const WEEK = 604_800; // 7 din ka cache

// Wikimedia ko apni pehchaan batana zaroori hai
const headers = {
  "User-Agent":
    process.env.WIKI_USER_AGENT ?? "RamgarhSainianVillageSite/1.0 (set WIKI_USER_AGENT in .env.local)",
  Accept: "application/json",
};

export type WikiSummary = {
  title: string;
  description?: string;
  extract: string;
  url: string;
  lang: "en" | "pa";
  image?: { src: string; width: number; height: number };
};

const slugTitle = (t: string) => encodeURIComponent(t.replace(/ /g, "_"));

async function fetchSummary(lang: "en" | "pa", title: string): Promise<WikiSummary | null> {
  try {
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${slugTitle(title)}`, {
      headers,
      next: { revalidate: WEEK },
    });
    if (!res.ok) return null;
    const j = await res.json();
    if (!j?.extract || j.type === "disambiguation") return null;

    // Sirf Wikimedia Commons ki tasveer (free license). en.wikipedia ki local uploads fair-use ho sakti hain.
    const th = j.thumbnail;
    const free = typeof th?.source === "string" && th.source.includes("/wikipedia/commons/");

    return {
      title: j.title,
      description: j.description,
      extract: j.extract,
      url: j.content_urls?.desktop?.page ?? `https://${lang}.wikipedia.org/wiki/${slugTitle(title)}`,
      lang,
      image: free ? { src: th.source, width: th.width, height: th.height } : undefined,
    };
  } catch {
    return null;
  }
}

// English article ka Punjabi Wikipedia wala jora (agar ho)
async function punjabiTitle(enTitle: string): Promise<string | null> {
  try {
    const url =
      "https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=pa&redirects=1" +
      `&titles=${slugTitle(enTitle)}&format=json&formatversion=2`;
    const res = await fetch(url, { headers, next: { revalidate: WEEK } });
    if (!res.ok) return null;
    const j = await res.json();
    const t = j?.query?.pages?.[0]?.langlinks?.[0]?.title;
    return typeof t === "string" ? t : null;
  } catch {
    return null;
  }
}

export async function getTopicSummary(
  wiki: string,
  locale: Locale
): Promise<{ data: WikiSummary | null; fallback: boolean }> {
  if (locale === "pa") {
    const pa = await punjabiTitle(wiki);
    if (pa) {
      const s = await fetchSummary("pa", pa);
      if (s) return { data: s, fallback: false };
    }
    const en = await fetchSummary("en", wiki);
    return { data: en, fallback: en !== null }; // Punjabi nahi mili, English dikha rahe hain
  }
  return { data: await fetchSummary("en", wiki), fallback: false };
}