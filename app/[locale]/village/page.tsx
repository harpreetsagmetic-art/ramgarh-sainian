import Container from "@/components/Container";
import NriSection from "@/components/NriSection";
import PageBanner from "@/components/PageBanner";
import { labels, pick, village } from "@/lib/content";
import { admin, census, dataSources, projection, villageAbout, x } from "@/lib/extra";
import { getDictionary, isLocale } from "@/lib/i18n";
import { User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function VillagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const stats = [
    { label: x.population, value: String(census.population) },
    { label: x.households, value: String(census.households) },
    { label: x.literacy, value: `${census.literacyPct}%` },
    { label: x.sexRatio, value: String(census.sexRatio) },
    { label: x.children, value: String(census.children) },
    { label: x.workers, value: String(census.workers) },
  ];

  const adminRows = [
    { label: x.pin, value: admin.pin },
    { label: x.postOffice, value: pick(locale, admin.postOffice) },
    { label: x.censusCode, value: admin.censusCode },
    { label: x.gramPanchayat, value: pick(locale, admin.gramPanchayat) },
    { label: x.tehsil, value: pick(locale, admin.tehsil) },
    { label: x.district, value: pick(locale, admin.district) },
  ];

  return (
    <>
      <PageBanner title={t.nav.village} subtitle={t.site.location} image="/images/hero.jpg" />
      <Container className="space-y-10 py-8">
        {/* About */}
        <section>
          <h2 className="mb-2 text-xl font-bold">{pick(locale, labels.about)}</h2>
          <p className="leading-relaxed text-navy/80">{pick(locale, villageAbout)}</p>
        </section>

        {/* Census 2011 */}
        <section>
          <h2 className="text-xl font-bold">{pick(locale, labels.glance)}</h2>
          <p className="mb-3 text-sm text-navy/60">{pick(locale, x.census)}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-saffron">{s.value}</p>
                <p className="text-sm text-navy/70">{pick(locale, s.label)}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-navy/60">{pick(locale, x.censusNote)}</p>
        </section>

        {/* Projected 2026 */}
        <section>
          <h2 className="text-xl font-bold">{pick(locale, x.projectedTitle)}</h2>
          <p className="mb-3 text-sm text-navy/60">{pick(locale, x.projectedNote)}</p>
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-navy/10 text-left text-navy/60">
                  <th className="p-3 font-medium">{pick(locale, x.indicator)}</th>
                  <th className="p-3 text-right font-medium">2011</th>
                  <th className="p-3 text-right font-medium">2026 *</th>
                  <th className="p-3 text-right font-medium">{pick(locale, x.change)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {projection.map((r, i) => (
                  <tr key={i}>
                    <td className="p-3 font-medium">{pick(locale, r.label)}</td>
                    <td className="p-3 text-right">{r.y2011}</td>
                    <td className="p-3 text-right font-bold text-saffron">{r.y2026}</td>
                    <td className="p-3 text-right text-navy/70">{r.change ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Administrative details */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, x.adminTitle)}</h2>
          <ul className="divide-y divide-navy/10 rounded-2xl bg-white shadow-sm">
            {adminRows.map((r, i) => (
              <li key={i} className="flex items-center justify-between gap-3 p-4">
                <span className="text-navy/70">{pick(locale, r.label)}</span>
                <span className="text-right font-medium">{r.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-navy/60">
            {pick(locale, x.sources)}:{" "}
            {dataSources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ", "}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {s.name}
                </a>
              </span>
            ))}
          </p>
        </section>

        {/* Leaders */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, labels.leaders)}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {village.leaders.map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex size-14 items-center justify-center rounded-full bg-navy text-gold">
                  <User />
                </div>
                <div>
                  <p className="font-bold">{pick(locale, l.name)}</p>
                  <p className="text-sm text-navy/70">{pick(locale, l.role)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NRI */}
        <NriSection locale={locale} />
      </Container>
    </>
  );
}