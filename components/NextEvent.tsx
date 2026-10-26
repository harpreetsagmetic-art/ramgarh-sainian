"use client";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

type Ev = { date: string; title: string };

export default function NextEvent({
  events, heading, daysLabel, todayLabel,
}: { events: Ev[]; heading: string; daysLabel: string; todayLabel: string }) {
  const [next, setNext] = useState<{ title: string; days: number } | null>(null);

  // Countdown browser mein hi nikalte hain, taaki "kitne din baaki" hamesha aaj ke hisaab se ho
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events
      .map((e) => ({ title: e.title, when: new Date(`${e.date}T00:00:00`) }))
      .filter((e) => e.when >= today)
      .sort((a, b) => a.when.getTime() - b.when.getTime());

    if (upcoming[0]) {
      const days = Math.round((upcoming[0].when.getTime() - today.getTime()) / 86400000);
      setNext({ title: upcoming[0].title, days });
    }
  }, [events]);

  if (!next) return null;

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-navy p-5 text-white shadow-sm">
      <CalendarDays className="shrink-0 text-gold" size={36} />
      <div className="flex-1">
        <p className="text-sm text-saffron">{heading}</p>
        <p className="text-lg font-bold">{next.title}</p>
      </div>
      <div className="text-center">
        {next.days === 0 ? (
          <p className="text-xl font-bold text-gold">{todayLabel}</p>
        ) : (
          <>
            <p className="text-3xl font-bold text-gold">{next.days}</p>
            <p className="text-xs">{daysLabel}</p>
          </>
        )}
      </div>
    </div>
  );
}