import { x } from "@/lib/extra";
import type { Locale } from "@/lib/i18n";
import { ScrollText } from "lucide-react";
import Link from "next/link";

export default function HistoryLink({ locale }: { locale: Locale }) {
  return (
    <Link
      href={`/${locale}/history`}
      className="flex items-center gap-4 rounded-2xl bg-navy p-5 text-white shadow-sm active:scale-95"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
        <ScrollText />
      </span>
      <span>
        <span className="block text-lg font-bold text-gold">{x.historyTitle[locale]}</span>
        <span className="block text-sm text-white/80">{x.historyCardText[locale]}</span>
      </span>
    </Link>
  );
}