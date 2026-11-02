"use client";
import { x } from "@/lib/extra";
import { fmtDay, type CalItem, type Kind } from "@/lib/gurpurab";
import type { Locale } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import { ItemCard } from "./CalendarBits";
import DaysLeft from "./DaysLeft";

type Filter = "all" | Kind;

const filters: { id: Filter; label: { pa: string; en: string } }[] = [
  { id: "all", label: x.filterAll },
  { id: "gurpurab", label: x.kindGurpurab },
    { id: "festival", label: x.kindFestival },
  { id: "sangrand", label: x.kindSangrand },
  { id: "puranmashi", label: x.kindPuranmashi },
  { id: "massia", label: x.kindMassia },
  { id: "historical", label: x.kindHistorical },
];

export default function CalendarList({ items, locale }: { items: CalItem[]; locale: Locale }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [today, setToday] = useState<string | null>(null);

  // Beeta hua din browser ki aaj ki date se hatao (page cache purana ho sakta hai)
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }));
  }, []);

  const groups = useMemo(() => {
    const shown = items.filter(
      (i) => (!today || i.date >= today) && (filter === "all" || i.kind === filter)
    );
    const m = new Map<string, CalItem[]>();
    for (const i of shown) {
      const arr = m.get(i.date);
      if (arr) arr.push(i);
      else m.set(i.date, [i]);
    }
    return Array.from(m.entries());
  }, [items, filter, today]);

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium active:scale-95 ${
              filter === f.id ? "border-navy bg-navy text-gold" : "border-saffron bg-white"
            }`}
          >
            {f.label[locale]}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl bg-white p-4 text-navy/70 shadow-sm">{x.noItems[locale]}</p>
      ) : (
        groups.map(([date, list]) => (
          <section key={date} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">{fmtDay(date, locale)}</h2>
              <span className="text-sm font-medium text-saffron">
                <DaysLeft date={date} daysLabel={x.daysLeft[locale]} todayLabel={x.todayLabel[locale]} />
              </span>
            </div>
            {list.map((i) => (
              <ItemCard key={i.key} item={i} locale={locale} variant="white" />
            ))}
          </section>
        ))
      )}
    </div>
  );
}