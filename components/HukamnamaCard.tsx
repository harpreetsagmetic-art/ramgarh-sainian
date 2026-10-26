import { labels, links, pick } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { BookOpen } from "lucide-react";

export default function HukamnamaCard({ locale }: { locale: Locale }) {
  return (
    <div className="rounded-2xl bg-navy p-5 text-white">
      <h2 className="flex items-center gap-2 text-lg font-bold text-gold">
        <BookOpen size={20} /> {pick(locale, labels.hukamnama)}
      </h2>
      <p className="mt-2 text-white/80">{pick(locale, labels.hukamnamaNote)}</p>
      <a
        href={links.hukamnamaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block rounded-xl bg-gold px-5 py-2 font-bold text-navy active:scale-95"
      >
        {pick(locale, labels.hukamnamaBtn)}
      </a>
    </div>
  );
}