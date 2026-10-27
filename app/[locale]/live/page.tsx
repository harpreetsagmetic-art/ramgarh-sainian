import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import { pick } from "@/lib/content";
import { x } from "@/lib/extra";
import { isLocale } from "@/lib/i18n";
import { channelUrl, getRecentVideos, liveEmbedUrl, liveWatchUrl } from "@/lib/live";
import { ExternalLink, Play } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 900;

export default async function LivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const videos = await getRecentVideos(6);
  const fmt = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString(locale === "pa" ? "pa-IN" : "en-IN", {
          day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
        })
      : "";

  return (
    <>
      <PageBanner title={pick(locale, x.liveTitle)} subtitle={pick(locale, x.liveFrom)} image="/images/hero.jpg" />

      <Container className="space-y-6 py-8">
        {/* Live player */}
        <div className="overflow-hidden rounded-2xl border-4 border-gold bg-black shadow-lg">
          <div className="aspect-video">
            <iframe
              src={liveEmbedUrl}
              title={pick(locale, x.liveTitle)}
              className="size-full"
              loading="lazy"
              allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        <p className="text-sm text-navy/70">{pick(locale, x.liveNote)}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={liveWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-saffron px-6 py-3 font-bold text-navy active:scale-95"
          >
            {pick(locale, x.openLive)} <ExternalLink size={16} />
          </a>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3 font-bold text-gold active:scale-95"
          >
            {pick(locale, x.openChannel)} <ExternalLink size={16} />
          </a>
        </div>

        {/* Recent videos */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, x.recentVideos)}</h2>
          {videos.length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-navy/70 shadow-sm">{pick(locale, x.noRecent)}</p>
          ) : (
            <ul className="divide-y divide-navy/10 rounded-2xl bg-white shadow-sm">
              {videos.map((v) => (
                <li key={v.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 active:bg-cream"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                      <Play size={18} />
                    </span>
                    <span>
                      <span className="block font-medium">{v.title}</span>
                      <span className="block text-xs text-navy/60">{fmt(v.published)}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="text-xs text-navy/50">{pick(locale, x.liveSource)}</p>
      </Container>
    </>
  );
}