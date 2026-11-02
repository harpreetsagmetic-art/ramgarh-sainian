"use client";
import { x } from "@/lib/extra";
import { fmtDay, toItems, type CalItem, type DayInfo } from "@/lib/gurpurab";
import type { Locale } from "@/lib/i18n";
import { ArrowRight, CalendarDays, ScrollText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ItemCard } from "./CalendarBits";
import DaysLeft from "./DaysLeft";
import TodayDate from "./TodayDate";

type Data = { day: DayInfo | null; nextGurpurab: CalItem | null; historySoon: CalItem[] };

export default function TodayStrip({ locale }: { locale: Locale }) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/today", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Data | null) => setData(j ?? { day: null, nextGurpurab: null, historySoon: [] }))
      .catch(() => {
        if (!ctrl.signal.aborted) setData({ day: null, nextGurpurab: null, historySoon: [] });
      });
    return () => ctrl.abort();
  }, []);

  const day = data?.day ?? null;
  const items = day ? toItems([day]) : [];
  const today = items.filter((i) => i.kind !== "historical");
  const history = items.filter((i) => i.kind === "historical");
  const next = data?.nextGurpurab ?? null;
  const soon = data?.historySoon ?? [];
  const daysLabel = x.daysLeft[locale];
  const todayLabel = x.todayLabel[locale];

  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      {/* Date */}
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

      {/* Aaj ke dihare */}
      {today.length > 0 && (
        <div>
          <h2 className="mb-2 font-bold">{x.todayOccasions[locale]}</h2>
          <div className="space-y-2">
            {today.map((i) => (
              <ItemCard key={i.key} item={i} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Aaj ka itihaas */}
      {history.length > 0 && (
        <div className="border-t border-navy/10 pt-3">
          <h2 className="mb-2 flex items-center gap-2 font-bold">
            <ScrollText size={18} className="text-saffron" /> {x.todayHistory[locale]}
          </h2>
          <div className="space-y-2">
            {history.map((i) => (
              <ItemCard key={i.key} item={i} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Agla gurpurab */}
      {next && (
        <div className="border-t border-navy/10 pt-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="font-bold">{x.nextGurpurab[locale]}</h2>
            <span className="text-sm font-medium text-saffron">
              <DaysLeft date={next.date} daysLabel={daysLabel} todayLabel={todayLabel} />
            </span>
          </div>
          <p className="mb-1 text-sm text-navy/60">{fmtDay(next.date, locale)}</p>
          <ItemCard item={next} locale={locale} />
        </div>
      )}

      {/* Agle 7 din ka itihaas */}
      {soon.length > 0 && (
        <div className="border-t border-navy/10 pt-3">
          <h2 className="mb-2 font-bold">{x.historySoon[locale]}</h2>
          <ul className="space-y-2 text-sm">
            {soon.map((i) => (
              <li key={i.key}>
                <p className="text-xs text-navy/60">{fmtDay(i.date, locale)}</p>
                <p className="font-medium">{i.name[locale]}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href={`/${locale}/calendar`}
        className="inline-flex items-center gap-1 text-sm font-bold text-saffron"
      >
        {x.viewCalendar[locale]} <ArrowRight size={14} />
      </Link>
    </section>
  );
}