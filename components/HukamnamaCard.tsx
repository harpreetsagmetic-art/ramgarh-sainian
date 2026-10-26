import { labels, links, pick } from "@/lib/content";
import { getHukamnama } from "@/lib/hukamnama";
import type { Locale } from "@/lib/i18n";
import { BookOpen } from "lucide-react";

export default async function HukamnamaCard({ locale }: { locale: Locale }) {
  const hukam = await getHukamnama();

  return (
    <div className="rounded-2xl bg-navy p-5 text-white">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gold">
        <BookOpen size={20} /> {pick(locale, labels.hukamnama)}
      </h2>

      {hukam ? (
        <>
          <p className="mt-2 text-sm text-white/70">
            Ang {hukam.pageNo}
            {hukam.raag.pa ? (
              <>
                {" • "}
                <span lang="pa">{hukam.raag.pa}</span>
              </>
            ) : null}
            {hukam.raag.en ? ` (${hukam.raag.en})` : ""}
            {hukam.writer ? ` • ${hukam.writer}` : ""}
          </p>

          <div className="mt-4 space-y-4">
            {hukam.verses.map((v) => (
              <div key={v.id}>
                <p lang="pa" className="text-xl font-semibold leading-relaxed text-gold">
                  {v.gurmukhi}
                </p>
                {v.punjabi ? (
                  <p lang="pa" className="mt-1 text-white/90">
                    {v.punjabi}
                  </p>
                ) : null}
                {v.english ? (
                  <p lang="en" className="mt-1 text-sm text-white/70">
                    {v.english}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-2 text-white/80">{pick(locale, labels.hukamnamaNote)}</p>
      )}

      <a
        href={links.hukamnamaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block rounded-xl bg-gold px-5 py-2 font-bold text-navy active:scale-95"
      >
        {pick(locale, labels.hukamnamaBtn)}
      </a>
    </div>
  );
}