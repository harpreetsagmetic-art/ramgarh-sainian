import { pick } from "@/lib/content";
import { x } from "@/lib/extra";
import { getDay, holidayName, istDate, significance } from "@/lib/gurpurab";
import type { Locale } from "@/lib/i18n";
import { CalendarDays, ScrollText } from "lucide-react";
import TodayDate from "./TodayDate";

export default async function TodayStrip({ locale }: { locale: Locale }) {
  const day = await getDay(istDate(0));
  const today = day?.holidays.filter((h) => h.type !== "historical") ?? [];
  const history = day?.holidays.filter((h) => h.type === "historical") ?? [];

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <CalendarDays className="mt-1 shrink-0 text-saffron" />
        <div>
          <p className="text-lg font-bold">
            <TodayDate locale={locale} />
          </p>
          {day && (
            <p className="text-sm text-navy/70">
              {day.nanakshahi.day} {day.nanakshahi.monthName[locale]},{" "}
              {pick(locale, x.nanakshahi)} {day.nanakshahi.year}
            </p>
          )}
        </div>
      </div>

      {today.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {today.map((h, i) => (
            <li key={`${h.id}-${i}`} className="rounded-full bg-gold px-3 py-1 text-sm font-bold">
              {holidayName(h, locale)}
            </li>
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <div className="mt-4 border-t border-navy/10 pt-3">
          <h2 className="flex items-center gap-2 font-bold">
            <ScrollText size={18} className="text-saffron" /> {pick(locale, x.todayHistory)}
          </h2>
          <ul className="mt-2 space-y-2">
            {history.map((h, i) => (
              <li key={`${h.id}-${i}`}>
                <p className="font-medium">{holidayName(h, locale)}</p>
                <p className="text-sm text-navy/70">{significance(h, locale)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}