import Container from "@/components/Container";
import HistoryBrowser from "@/components/HistoryBrowser";
import PageBanner from "@/components/PageBanner";
import { x } from "@/lib/extra";
import { topics } from "@/lib/history-topics";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export default async function HistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Client ko sirf zaroori fields bhejte hain
  const items = topics.map(({ slug, group, name, local }) => ({ slug, group, name, local }));

  return (
    <>
      <PageBanner title={x.historyTitle[locale]} subtitle={x.historySub[locale]} image="/images/hero.jpg" />
      <Container className="py-8">
        <HistoryBrowser items={items} locale={locale} />
      </Container>
    </>
  );
}