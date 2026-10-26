import { nri, pick } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Globe, Heart, Landmark } from "lucide-react";

const icons = [Landmark, Heart];

export default function NriSection({ locale }: { locale: Locale }) {
  return (
    <section className="rounded-3xl bg-navy p-6 text-white md:p-8">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-gold">
        <Globe /> {pick(locale, nri.title)}
      </h2>
      <p className="mt-3 leading-relaxed text-white/85">{pick(locale, nri.intro)}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {nri.roles.map((r, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={r.id} className="rounded-2xl border border-white/15 bg-white/5 p-4">
              <p className="flex items-center gap-2 font-bold text-gold">
                <Icon size={18} /> {pick(locale, r.title)}
              </p>
              <p className="mt-1 text-sm text-white/80">{pick(locale, r.text)}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center font-medium text-saffron">{pick(locale, nri.closing)}</p>
    </section>
  );
}