import { x } from "@/lib/extra";
import type { Locale } from "@/lib/i18n";
import { Download, FileText, ZoomIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const MAP_PDF = "/maps/ramgarh-sainian-map.pdf";

export default function VillageMapCard({ locale }: { locale: Locale }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="p-5 pb-3">
        <h2 className="text-xl font-bold">{x.mapTitle[locale]}</h2>
        <p className="mt-1 text-sm text-navy/70">{x.mapSub[locale]}</p>
      </div>

      {/* Nakshe par click: zoom wala viewer page */}
      <Link href={`/${locale}/village-map`} className="group relative block" aria-label={x.mapOpen[locale]}>
        <Image
          src="/maps/ramgarh-sainian-map-preview.webp"
          alt={x.mapAlt[locale]}
          width={1800}
          height={1273}
          unoptimized
          className="h-auto w-full"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-bold text-gold shadow-lg group-active:scale-95">
          <ZoomIn size={16} /> {x.mapOpen[locale]}
        </span>
      </Link>

      <div className="flex flex-wrap gap-2 p-4">
        <a
          href={MAP_PDF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-saffron px-4 py-2 font-bold text-navy active:scale-95"
        >
          <FileText size={16} /> {x.mapPdf[locale]}
        </a>
        <a
          href={MAP_PDF}
          download="Ramgarh-Sainian-Village-Map.pdf"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-navy px-4 py-2 font-bold text-navy active:scale-95"
        >
          <Download size={16} /> {x.mapDownload[locale]}
        </a>
      </div>

      <p className="px-5 pb-4 text-xs text-navy/50">{x.mapCredit[locale]}</p>
    </section>
  );
}