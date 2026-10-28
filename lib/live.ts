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

// ---------- Live ho to wahi, warna sabse naya video ----------

const API = "https://www.googleapis.com/youtube/v3";
// Channel ID "UC..." se shuru hota hai, uska "uploads" playlist ID "UU..." hota hai
const UPLOADS_PLAYLIST = "UU" + CHANNEL_ID.slice(2);

export type LiveState =
  | { mode: "live" | "latest"; videoId: string; title: string; publishedAt: string }
  | { mode: "unknown" }; // key nahi hai ya API fail

type YtVideo = {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    liveBroadcastContent: "live" | "upcoming" | "none";
  };
  status?: { embeddable?: boolean };
};

export async function getLiveState(): Promise<LiveState> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return { mode: "unknown" };

  try {
    // 1) Latest 15 uploads ke video IDs
    const r1 = await fetch(
      `${API}/playlistItems?part=contentDetails&playlistId=${UPLOADS_PLAYLIST}&maxResults=15&key=${key}`,
      { cache: "no-store" }
    );
    if (!r1.ok) {
      console.error("[live] playlistItems failed", r1.status); // key kabhi log nahi karte
      return { mode: "unknown" };
    }
    const j1 = await r1.json();
    const ids: string[] = (j1.items ?? []).map(
      (i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId
    );
    if (ids.length === 0) return { mode: "unknown" };

    // 2) Un videos ki detail: live hai ya nahi, embed ho sakta hai ya nahi
    const r2 = await fetch(`${API}/videos?part=snippet,status&id=${ids.join(",")}&key=${key}`, {
      cache: "no-store",
    });
    if (!r2.ok) {
      console.error("[live] videos failed", r2.status);
      return { mode: "unknown" };
    }
    const j2 = await r2.json();
    const videos = ((j2.items ?? []) as YtVideo[])
      .filter((v) => v.status?.embeddable) // jo chal hi nahi sakta use dikhana hi nahi
      .sort((a, b) => b.snippet.publishedAt.localeCompare(a.snippet.publishedAt)); // naya pehle

    // 3) Live mile to wahi, warna sabse naya normal video ("upcoming" ko chhodte hain)
    const live = videos.find((v) => v.snippet.liveBroadcastContent === "live");
    const latest = videos.find((v) => v.snippet.liveBroadcastContent === "none");
    const chosen = live ?? latest;
    if (!chosen) return { mode: "unknown" };

    return {
      mode: live ? "live" : "latest",
      videoId: chosen.id,
      title: chosen.snippet.title,
      publishedAt: chosen.snippet.publishedAt,
    };
  } catch {
    return { mode: "unknown" };
  }
}