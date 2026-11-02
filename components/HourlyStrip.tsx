"use client";
import type { Locale } from "@/lib/i18n";
import { fmtHour, fromNow, nowKey, weatherInfo, type Hour } from "@/lib/weather";
import { wx } from "@/lib/weather-text";
import { useEffect, useState } from "react";
import WeatherIcon from "./WeatherIcon";

export default function HourlyStrip({
  hours, locale, count = 24,
}: { hours: Hour[]; locale: Locale; count?: number }) {
  // Pehle server wali list (hydration mismatch nahi), phir browser ke "abhi" ke hisaab se
  const [list, setList] = useState<Hour[]>(() => hours.slice(0, count));

  useEffect(() => {
    setList(fromNow(hours, nowKey(), count));
  }, [hours, count]);

  return (
    <div
      role="list"
      aria-label={wx.next24[locale]}
      className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2"
    >
      {list.map((h, i) => {
        const info = weatherInfo(h.code, h.isDay);
        return (
          <div
            key={h.time}
            role="listitem"
            className={`flex w-16 shrink-0 snap-start flex-col items-center gap-1 rounded-xl p-2 text-center ${
              i === 0 ? "bg-gold/40" : "bg-cream"
            }`}
          >
            <span className="text-xs text-navy/70">{i === 0 ? wx.now[locale] : fmtHour(h.time)}</span>
                       <WeatherIcon kind={info.kind} size={28} label={info.text[locale]} />
            <span className="font-bold">{Math.round(h.temp)}°</span>
            <span className="min-h-4 text-xs font-medium text-saffron">{h.rain >= 20 ? `💧${h.rain}%` : ""}</span>
          </div>
        );
      })}
    </div>
  );
}