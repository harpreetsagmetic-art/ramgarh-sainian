import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import { labels, pick } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <>
      <PageBanner title={t.nav.gallery} />
      <Container className="py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-linear-to-br from-navy to-navy/70 shadow-sm" />
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-navy/60">{pick(locale, labels.gallerySoon)}</p>
      </Container>
    </>
  );
}