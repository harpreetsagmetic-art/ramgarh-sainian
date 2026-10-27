import { pick } from "@/lib/content";
import { x } from "@/lib/extra";
import type { Locale } from "@/lib/i18n";
import { Radio } from "lucide-react";
import Link from "next/link";

export default function LiveLink({ locale }: { locale: Locale }) {
  return (
    <Link
      href={`/${locale}/live`}
      className="flex items-center gap-4 rounded-2xl bg-saffron p-5 text-navy shadow-sm active:scale-95"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
        <Radio />
      </span>
      <span>
        <span className="block text-lg font-bold">{pick(locale, x.liveTitle)}</span>
        <span className="block text-sm">{pick(locale, x.liveCardText)}</span>
      </span>
    </Link>
  );
}