
import type { Locale } from "./i18n";

const WEEK = 604_800; // 7 days cache

const headers = {
  "User-Agent":
    process.env.WIKI_USER_AGENT ??
    "RamgarhSainianVillageSite/1.0 (set WIKI_USER_AGENT in .env.local)",
  Accept: "application/json",
};

export type WikiSummary = {
  title: string;
  description?: string;
  extract: string;
  url: string;
  lang: "en" | "pa";
  image?: {
    src: string;
    width: number;
    height: number;
  };
};

const slugTitle = (t: string) =>
  encodeURIComponent(t.replace(/ /g, "_"));

// Fetch a larger Wikimedia Commons image
async function fetchCommonsImage(
  lang: "en" | "pa",
  title: string
): Promise<WikiSummary["image"] | undefined> {
  try {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      prop: "pageimages",
      piprop: "thumbnail",
      pithumbsize: "1280",
      redirects: "1",
      titles: title,
    });

    const res = await fetch(
      `https://${lang}.wikipedia.org/w/api.php?${params}`,
      {
        headers,
        next: { revalidate: WEEK },
      }
    );

    if (!res.ok) return undefined;

    const j = await res.json();
    const page = j?.query?.pages?.[0];
    const th = page?.thumbnail;

    // Only use Wikimedia Commons images
    const free =
      typeof th?.source === "string" &&
      th.source.includes("/wikipedia/commons/");

    if (!free) return undefined;

    return {
      src: th.source,
      width: th.width,
      height: th.height,
    };
  } catch {
    return undefined;
  }
}

async function fetchSummary(
  lang: "en" | "pa",
  title: string
): Promise<WikiSummary | null> {
  try {
    const res = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${slugTitle(title)}`,
      {
        headers,
        next: { revalidate: WEEK },
      }
    );

    if (!res.ok) return null;

    const j = await res.json();

    if (!j?.extract || j.type === "disambiguation") return null;

    // Get 1280px Commons image separately
    const image = await fetchCommonsImage(lang, title);

    return {
      title: j.title,
      description: j.description,
      extract: j.extract,
      url:
        j.content_urls?.desktop?.page ??
        `https://${lang}.wikipedia.org/wiki/${slugTitle(title)}`,
      lang,
      image,
    };
  } catch {
    return null;
  }
}

// Find Punjabi Wikipedia article title
async function punjabiTitle(
  enTitle: string
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      action: "query",
      prop: "langlinks",
      lllang: "pa",
      redirects: "1",
      titles: enTitle,
      format: "json",
      formatversion: "2",
    });

    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?${params}`,
      {
        headers,
        next: { revalidate: WEEK },
      }
    );

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
): Promise<{
  data: WikiSummary | null;
  fallback: boolean;
}> {
  if (locale === "pa") {
    const pa = await punjabiTitle(wiki);

    if (pa) {
      const s = await fetchSummary("pa", pa);
      if (s) return { data: s, fallback: false };
    }

    const en = await fetchSummary("en", wiki);

    return {
      data: en,
      fallback: en !== null,
    };
  }

  return {
    data: await fetchSummary("en", wiki),
    fallback: false,
  };
}
