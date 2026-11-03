import Container from "@/components/Container";
import MapViewer from "@/components/MapViewer";
import PageBanner from "@/components/PageBanner";
import { MAP_PDF } from "@/components/VillageMapCard";
import { x } from "@/lib/extra";
import { isLocale } from "@/lib/i18n";
import { Download, FileText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: `${x.mapTitle[locale]} | Ramgarh Sainian`, description: x.mapSub[locale] };
}

export default async function VillageMapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageBanner title={x.mapTitle[locale]} subtitle={x.mapSub[locale]} image="/images/hero.jpg" />
      <Container className="space-y-4 py-6">
        <MapViewer
          previewSrc="/maps/ramgarh-sainian-map-preview.webp"
          fullSrc="/maps/ramgarh-sainian-map-full.webp"
          labels={{
            alt: x.mapAlt[locale],
            loadingHd: x.mapLoadingHd[locale],
            zoomIn: x.mapZoomIn[locale],
            zoomOut: x.mapZoomOut[locale],
            fit: x.mapFit[locale],
            region: x.mapTitle[locale],
          }}
        />

        <p className="text-sm text-navy/70">{x.mapHint[locale]}</p>

        <div className="flex flex-wrap gap-2">
          <a
            href={MAP_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-saffron px-5 py-3 font-bold text-navy active:scale-95"
          >
            <FileText size={18} /> {x.mapPdf[locale]}
          </a>
          <a
            href={MAP_PDF}
            download="Ramgarh-Sainian-Village-Map.pdf"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-navy px-5 py-3 font-bold text-navy active:scale-95"
          >
            <Download size={18} /> {x.mapDownload[locale]}
          </a>
        </div>

        <p className="rounded-xl bg-gold/20 p-3 text-xs text-navy/70">{x.mapNote[locale]}</p>
        <p className="text-xs text-navy/50">{x.mapCredit[locale]}</p>
      </Container>
    </>
  );
}