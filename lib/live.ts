// SGPC Sri Amritsar ka official YouTube channel
export const CHANNEL_ID = "UCYn6UEtQ771a_OWSiNBoG8w";
export const channelUrl = "https://www.youtube.com/@SGPCSriAmritsar";

// Channel jis stream par live ho, ye embed wahi apne aap chalata hai (koi API key nahi)
export const liveEmbedUrl = `https://www.youtube-nocookie.com/embed/live_stream?channel=${CHANNEL_ID}`;
// YouTube par seedha live page
export const liveWatchUrl = `https://www.youtube.com/channel/${CHANNEL_ID}/live`;

export type RecentVideo = { id: string; title: string; published: string };

const decodeXml = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// YouTube ka RSS feed (Atom XML): channel ke latest videos
export async function getRecentVideos(limit = 6): Promise<RecentVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, {
      next: { revalidate: 900 }, // 15 minute
    });
    if (!res.ok) return [];
    const xml = await res.text();

    return xml
      .split("<entry>")
      .slice(1, limit + 1)
      .map((e) => {
        const id = /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(e)?.[1];
        const title = /<title>([^<]*)<\/title>/.exec(e)?.[1];
        const published = /<published>([^<]+)<\/published>/.exec(e)?.[1] ?? "";
        return id && title ? { id, title: decodeXml(title), published } : null;
      })
      .filter((v): v is RecentVideo => v !== null);
  } catch {
    return []; // feed na mile to bas list khaali, page na tootay
  }
}