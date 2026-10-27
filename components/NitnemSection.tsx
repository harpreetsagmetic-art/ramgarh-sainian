import { pick } from "@/lib/content";
import { appLinks, nitnem, x } from "@/lib/extra";
import type { Locale } from "@/lib/i18n";
import { Smartphone } from "lucide-react";

export default function NitnemSection({ locale }: { locale: Locale }) {
  const groups = [
    { title: x.morning, items: nitnem.morning },
    { title: x.evening, items: nitnem.evening },
    { title: x.otherBanis, items: nitnem.other },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{pick(locale, x.nitnemTitle)}</h2>
        <p className="text-sm text-navy/60">{pick(locale, x.nitnemIntro)}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {groups.map((g, gi) => (
          <div key={gi} className="rounded-2xl border-t-4 border-saffron bg-white p-4 shadow-sm">
            <h3 className="font-bold">{pick(locale, g.title)}</h3>
            <ol className="mt-3 space-y-3">
              {g.items.map((b, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-medium">{b.pa}</span>
                    <span className="block text-xs text-navy/60">{b.en}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-navy p-5 text-white">
        <h3 className="flex items-center gap-2 font-bold text-gold">
          <Smartphone size={18} /> {pick(locale, x.nitnemAppTitle)}
        </h3>
        <p className="mt-1 text-sm text-white/80">{pick(locale, x.nitnemAppText)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={appLinks.android}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gold px-4 py-2 text-sm font-bold text-navy active:scale-95"
          >
            Google Play
          </a>
          <a
            href={appLinks.ios}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-saffron px-4 py-2 text-sm font-bold text-navy active:scale-95"
          >
            App Store
          </a>
        </div>
      </div>
    </section>
  );
}