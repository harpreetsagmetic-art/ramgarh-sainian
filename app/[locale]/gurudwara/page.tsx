import Container from "@/components/Container";
import HukamnamaCard from "@/components/HukamnamaCard";
import LiveLink from "@/components/LiveLink";
import NitnemSection from "@/components/NitnemSection";
import PageBanner from "@/components/PageBanner";
import UpcomingSection from "@/components/UpcomingSection";
import { gurudwara, pick } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const revalidate = 1800;// har visit par taza Hukamnama

export default async function GurudwaraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <PageBanner title={`ੴ ${t.nav.gurudwara}`} subtitle={t.site.name} image="/images/hero.jpg" />
      <Container className="space-y-10 py-8">
        <p className="leading-relaxed text-navy/80">{pick(locale, gurudwara.about)}</p>
        <LiveLink locale={locale} />
        <HukamnamaCard locale={locale} />
        <NitnemSection locale={locale} />
        <UpcomingSection locale={locale} limit={40} />
      </Container>
    </>
  );
}