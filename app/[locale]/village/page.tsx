import Container from "@/components/Container";
import NriSection from "@/components/NriSection";
import PageBanner from "@/components/PageBanner";
import { achievements, labels, pick, village } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { GraduationCap, Shield, Stethoscope, Store, Tractor, Trophy, User } from "lucide-react";
import { notFound } from "next/navigation";

const achIcons = { student: GraduationCap, sport: Trophy, service: Shield } as const;

const dirCats = [
  { Icon: Stethoscope, label: { pa: "ਡਾਕਟਰ / ਸਿਹਤ", en: "Doctors / Health" } },
  { Icon: Store, label: { pa: "ਦੁਕਾਨਾਂ", en: "Shops" } },
  { Icon: Tractor, label: { pa: "ਖੇਤੀ ਸੰਦ / ਮਸ਼ੀਨਰੀ", en: "Farm equipment" } },
  { Icon: GraduationCap, label: { pa: "ਅਧਿਆਪਕ / ਪੜ੍ਹਾਈ", en: "Teachers / Education" } },
];

export default async function VillagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <PageBanner title={t.nav.village} subtitle={t.site.location} image="/images/hero.jpg" />
      <Container className="space-y-10 py-8">
        {/* About */}
        <section>
          <h2 className="mb-2 text-xl font-bold">{pick(locale, labels.about)}</h2>
          <p className="leading-relaxed text-navy/80">{pick(locale, village.about)}</p>
        </section>

        {/* Facts */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, labels.glance)}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {village.facts.map((f, i) => (
              <div key={i} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-saffron">{f.value}</p>
                <p className="text-sm text-navy/70">{pick(locale, f.label)}</p>
              </div>
            ))}
          </div>
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

        {/* Achievements */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{pick(locale, labels.achievements)}</h2>
          <div className="space-y-3">
            {achievements.map((a) => {
              const Icon = achIcons[a.kind as keyof typeof achIcons];
              return (
                <div key={a.id} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-bold">{pick(locale, a.name)}</p>
                    <p className="text-sm text-navy/70">{pick(locale, a.text)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Directory */}
        <section>
          <h2 className="text-xl font-bold">{pick(locale, labels.directory)}</h2>
          <p className="mb-3 text-sm text-navy/60">{pick(locale, labels.consentNote)}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {dirCats.map(({ Icon, label }, i) => (
              <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 font-bold">
                  <Icon className="text-saffron" /> {pick(locale, label)}
                </h3>
                <p className="mt-2 text-sm text-navy/60">{pick(locale, labels.noEntries)}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}