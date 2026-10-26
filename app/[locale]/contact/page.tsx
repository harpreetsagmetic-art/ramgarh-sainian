import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import { emergency, labels, pick, site } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { MapPin, Phone } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <PageBanner title={t.nav.contact} subtitle={t.site.location} />
      <Container className="space-y-10 py-8">
        <section className="space-y-3">
          <a href={`tel:${site.phone}`} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm active:scale-95">
            <Phone className="text-saffron" />
            <div>
              <p className="font-bold">{pick(locale, labels.call)}</p>
              <p className="text-navy/70">{site.phoneShow}</p>
            </div>
          </a>
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm active:scale-95"
          >
            <MapPin className="text-saffron" />
            <div>
              <p className="font-bold">{pick(locale, labels.openMap)}</p>
              <p className="text-navy/70">{t.site.name}, {t.site.location}</p>
            </div>
          </a>
        </section>

        {/* Emergency */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, labels.emergency)}</h2>

          <h3 className="mb-2 text-sm font-medium text-navy/60">{pick(locale, labels.national)}</h3>
          <div className="space-y-2">
            {emergency.national.map((n) => (
              <a
                key={n.number}
                href={`tel:${n.number}`}
                className="flex items-center justify-between rounded-2xl border-l-4 border-saffron bg-white p-4 shadow-sm active:scale-95"
              >
                <span className="pr-3">{pick(locale, n.label)}</span>
                <span className="flex items-center gap-2 text-lg font-bold">
                  <Phone size={18} className="text-saffron" /> {n.number}
                </span>
              </a>
            ))}
          </div>

          <h3 className="mb-2 mt-6 text-sm font-medium text-navy/60">{pick(locale, labels.local)}</h3>
          <div className="space-y-2">
            {emergency.local.map((n, i) => (
              <a
                key={i}
                href={`tel:${n.number}`}
                className="flex items-center justify-between rounded-2xl border-l-4 border-gold bg-white p-4 shadow-sm active:scale-95"
              >
                <span>{pick(locale, n.label)}</span>
                <span className="font-bold">{n.show}</span>
              </a>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}