import { pick } from "@/lib/content";
import { x } from "@/lib/extra";
import { fmtDay, getUpcoming, holidayName } from "@/lib/gurpurab";
import type { Locale } from "@/lib/i18n";
import { Moon, Star, Sun } from "lucide-react";
import DaysLeft from "./DaysLeft";

export default async function UpcomingSection({
  locale, limit = 8,
}: { locale: Locale; limit?: number }) {
  const list = await getUpcoming(31);
  const daysLabel = pick(locale, x.daysLeft);
  const todayLabel = pick(locale, x.todayLabel);

  const cards = [
    { type: "sangrand", label: x.nextSangrand, Icon: Sun },
    { type: "puranmashi", label: x.nextPuranmashi, Icon: Moon },
    { type: "massia", label: x.nextMassia, Icon: Star },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">{pick(locale, x.upcomingTitle)}</h2>

      {list.length === 0 ? (
        <p className="rounded-xl bg-white p-4 text-navy/70 shadow-sm">{pick(locale, x.upcomingNone)}</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {cards.map(({ type, label, Icon }) => {
              const h = list.find((i) => i.type === type);
              return (
                <div key={type} className="rounded-2xl border-b-4 border-saffron bg-white p-4 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-medium text-navy/70">
                    <Icon size={16} className="text-saffron" /> {pick(locale, label)}
                  </p>
                  {h ? (
                    <>
                      <p className="mt-1 font-bold">{fmtDay(h.date, locale)}</p>
                      <p className="text-sm font-medium text-saffron">
                        <DaysLeft date={h.date} daysLabel={daysLabel} todayLabel={todayLabel} />
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-navy/50">—</p>
                  )}
                </div>
              );
            })}
          </div>

          <ul className="divide-y divide-navy/10 rounded-2xl bg-white shadow-sm">
            {list.slice(0, limit).map((h, i) => (
              <li key={`${h.id}-${h.date}-${i}`} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="font-bold">{holidayName(h, locale)}</p>
                  <p className="text-sm text-navy/60">{fmtDay(h.date, locale)}</p>
                </div>
                <span className="shrink-0 text-sm font-medium text-saffron">
                  <DaysLeft date={h.date} daysLabel={daysLabel} todayLabel={todayLabel} />
                </span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-navy/50">{pick(locale, x.calendarSource)}</p>
        </>
      )}
    </section>
  );
}