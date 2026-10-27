"use client";
import { x } from "@/lib/extra";
import { holidayName, significance, type DayInfo } from "@/lib/gurpurab";
import type { Locale } from "@/lib/i18n";
import { CalendarDays, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import TodayDate from "./TodayDate";

type State = { day: DayInfo | null } | null; // null = loading

export default function TodayStrip({ locale }: { locale: Locale }) {
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/today", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setState(j ?? { day: null }))
      .catch(() => {
        if (!ctrl.signal.aborted) setState({ day: null });
      });
    return () => ctrl.abort();
  }, []);

  const day = state?.day ?? null;
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
          <p className="min-h-5 text-sm text-navy/70">
            {day &&
              `${day.nanakshahi.day} ${day.nanakshahi.monthName[locale]}, ${x.nanakshahi[locale]} ${day.nanakshahi.year}`}
          </p>
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
            <ScrollText size={18} className="text-saffron" /> {x.todayHistory[locale]}
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