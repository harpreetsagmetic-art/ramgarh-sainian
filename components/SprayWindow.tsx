"use client";
import type { Locale } from "@/lib/i18n";
import { fmtHourNum, fromNow, nowKey, type Hour } from "@/lib/weather";
import { wx } from "@/lib/weather-text";
import { useEffect, useState } from "react";

type Win = { day: "today" | "tomorrow"; from: number; to: number };

// Din ka waqt, hawa 12 km/h tak, barish ki sambhavna 30% tak, garmi 35 tak
function findWindows(list: Hour[], todayKey: string): Win[] {
  const out: Win[] = [];
  let cur: Win | null = null;
  for (const h of list) {
    const ok = h.isDay && h.wind <= 12 && h.rain <= 30 && h.temp <= 35;
    const hr = Number(h.time.slice(11, 13));
    const day = h.time.slice(0, 10) === todayKey ? "today" : "tomorrow";
    if (ok) {
      if (cur && cur.day === day && cur.to === hr) cur.to = hr + 1;
      else {
        cur = { day, from: hr, to: hr + 1 };
        out.push(cur);
      }
    } else {
      cur = null;
    }
  }
  return out;
}

export default function SprayWindow({ hours, locale }: { hours: Hour[]; locale: Locale }) {
  const [wins, setWins] = useState<Win[] | null>(null);

  useEffect(() => {
    const key = nowKey();
    setWins(findWindows(fromNow(hours, key, 24), key.slice(0, 10)));
  }, [hours]);

  return (
    <div className="rounded-xl bg-gold/30 p-3">
      <p className="font-bold">🧴 {wx.spray[locale]}</p>
      <div className="min-h-6">
        {wins !== null &&
          (wins.length === 0 ? (
            <p className="mt-1 text-sm">{wx.sprayNone[locale]}</p>
          ) : (
            <ul className="mt-1 space-y-1 text-sm">
              {wins.slice(0, 3).map((w, i) => (
                <li key={i} className="font-medium">
                  {w.day === "today" ? wx.today[locale] : wx.tomorrow[locale]}: {fmtHourNum(w.from)} – {fmtHourNum(w.to)}
                </li>
              ))}
            </ul>
          ))}
      </div>
      <p className="mt-2 text-xs text-navy/60">{wx.sprayNote[locale]}</p>
    </div>
  );
}