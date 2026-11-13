import { x } from "@/lib/extra";
import type { CalItem, Kind } from "@/lib/gurpurab";
import { guruNote } from "@/lib/gurus";
import type { Locale } from "@/lib/i18n";
import { Star } from "lucide-react";

const kindLabel = {
  gurpurab: x.kindGurpurab,
  sangrand: x.kindSangrand,
  puranmashi: x.kindPuranmashi,
  massia: x.kindMassia,
  historical: x.kindHistorical,
  other: x.kindOther,
    festival: x.kindFestival,
} as const;

const kindStyle: Record<Kind, string> = {
  gurpurab: "bg-gold text-navy",
  sangrand: "bg-saffron text-navy",
  puranmashi: "bg-navy text-gold",
  massia: "bg-navy/80 text-white",
  historical: "bg-navy/10 text-navy",
  other: "bg-navy/10 text-navy",
    festival: "bg-gold text-navy",
};

export function KindBadge({ kind, locale }: { kind: Kind; locale: Locale }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${kindStyle[kind]}`}>
      {kindLabel[kind][locale]}
    </span>
  );
}

export function GuruNote({ number, locale }: { number?: number; locale: Locale }) {
  const n = guruNote(number, locale);
  if (!n) return null;
  return (
    <details className="mt-2 rounded-lg bg-white/70 p-2 text-sm">
      <summary className="cursor-pointer font-medium text-saffron">{x.aboutGuru[locale]}</summary>
      <p className="mt-2 font-bold">
        {n.title} <span className="font-normal text-navy/60">({n.years})</span>
      </p>
      <p className="mt-1 text-navy/80">{n.text}</p>
      <p className="mt-1 text-xs text-navy/50">{x.guruNoteCaption[locale]}</p>
    </details>
  );
}

export function ItemCard({
  item, locale, variant = "cream",
}: { item: CalItem; locale: Locale; variant?: "cream" | "white" }) {
  return (
    <article
      className={`rounded-xl border-l-4 border-saffron p-3 ${
        variant === "white" ? "bg-white shadow-sm" : "bg-cream"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <KindBadge kind={item.kind} locale={locale} />
        {item.importance === 1 && <Star size={14} aria-hidden="true" className="fill-saffron text-saffron" />}
        <span className="text-xs text-navy/60">{item.ns[locale]}</span>
        {item.estimated && (
          <span className="rounded-full border border-navy/30 px-2 py-0.5 text-xs text-navy/70">
            {x.estimated[locale]}
          </span>
        )}
      </div>
      <p className="mt-1 font-bold">{item.name[locale]}</p>
      {item.text[locale] && <p className="mt-1 text-sm text-navy/80">{item.text[locale]}</p>}
      <GuruNote number={item.guru} locale={locale} />
    </article>
  );
}