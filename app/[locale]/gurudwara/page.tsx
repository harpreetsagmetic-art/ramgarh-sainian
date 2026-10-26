import Container from "@/components/Container";
import HukamnamaCard from "@/components/HukamnamaCard";
import PageBanner from "@/components/PageBanner";
import { events, formatDate, gurudwara, labels, pick, sewaSchedule } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { Clock, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

export default async function GurudwaraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  // [...events] copy banata hai, kyunki .sort() original array ko badal deta hai
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageBanner title={`ੴ ${t.nav.gurudwara}`} subtitle={t.site.name} image="/images/hero.jpg" />
      <Container className="space-y-10 py-8">
        <p className="leading-relaxed text-navy/80">{pick(locale, gurudwara.about)}</p>

        <HukamnamaCard locale={locale} />

        {/* Timings */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, labels.timings)}</h2>
          <ul className="divide-y divide-navy/10 rounded-2xl bg-white shadow-sm">
            {gurudwara.timings.map((x, i) => (
              <li key={i} className="flex items-center justify-between p-4">
                <span className="flex items-center gap-2 font-medium">
                  <Clock size={18} className="text-saffron" /> {pick(locale, x.label)}
                </span>
                <span className="text-navy/70">{x.value}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Programs */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, labels.programs)}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {gurudwara.programs.map((p) => (
              <div key={p.id} className="rounded-2xl border-l-4 border-saffron bg-white p-4 shadow-sm">
                <p className="font-bold">{pick(locale, p.title)}</p>
                <p className="text-sm text-navy/70">{pick(locale, p.text)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, labels.events)}</h2>
          <div className="space-y-3">
            {sortedEvents.map((e) => (
              <article key={e.id} className="rounded-2xl border-l-4 border-gold bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-saffron">{formatDate(e.date, locale)}</p>
                <h3 className="mt-1 text-lg font-bold">{pick(locale, e.title)}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-navy/70">
                  <MapPin size={14} /> {pick(locale, e.place)}
                </p>
                <p className="mt-2 text-navy/80">{pick(locale, e.text)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Sewa schedule */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, labels.sewa)}</h2>
          <ul className="divide-y divide-navy/10 rounded-2xl bg-white shadow-sm">
            {sewaSchedule.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 p-4">
                <span className="font-bold">{pick(locale, s.day)}</span>
                <span className="text-right text-sm text-navy/70">{pick(locale, s.who)}</span>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}