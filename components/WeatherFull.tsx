import { geo, labels, pick } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import {
    aqiInfo,
    buildAlerts,
    compass,
    farmTips,
    fmtClock,
    getWeather, weatherInfo,
} from "@/lib/weather";
import { wx } from "@/lib/weather-text";
import { ArrowUp, Cloud, Droplets, Eye, Sprout, Sun, Sunrise, Sunset, Wind } from "lucide-react";
import HourlyStrip from "./HourlyStrip";
import SprayWindow from "./SprayWindow";
import TodayDate from "./TodayDate";
import { AlertList, Attribution } from "./WeatherBits";
import WeatherIcon from "./WeatherIcon";

function dayLabel(date: string, i: number, locale: Locale) {
  if (i === 0) return wx.today[locale];
  if (i === 1) return wx.tomorrow[locale];
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(locale === "pa" ? "pa-IN" : "en-IN", {
    weekday: "long",
    timeZone: "UTC",
  });
}

function dayLength(sunrise: string, sunset: string) {
  const mins = Math.round((Date.parse(sunset) - Date.parse(sunrise)) / 60000);
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default async function WeatherFull({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const w = await getWeather(geo.lat, geo.lon);

  if (!w) {
    return <p className="rounded-2xl bg-white p-5 text-navy/70 shadow-sm">{wx.unavailable[locale]}</p>;
  }

  const c = w.current;
  const now = weatherInfo(c.code, c.isDay);
  const d0 = w.days[0];
  const alerts = buildAlerts(w);
  const tips = farmTips(w);
  const aqi = w.aqi ? aqiInfo(w.aqi.us) : null;

  const lo = Math.min(...w.days.map((d) => d.min));
  const hi = Math.max(...w.days.map((d) => d.max));
  const span = Math.max(hi - lo, 1);

  const metrics = [
    { Icon: Wind, label: wx.wind[locale], value: `${Math.round(c.wind)} km/h ${compass(c.windDir)}`, dir: c.windDir },
    { Icon: Wind, label: wx.gust[locale], value: `${Math.round(c.gust)} km/h` },
    { Icon: Droplets, label: wx.humidity[locale], value: `${Math.round(c.humidity)}%` },
    { Icon: Sun, label: wx.uv[locale], value: String(Math.round(c.uv * 10) / 10) },
    {
      Icon: Eye,
      label: wx.visibility[locale],
      value: c.vis === null ? "—" : c.vis >= 1000 ? `${Math.round(c.vis / 100) / 10} km` : `${Math.round(c.vis)} m`,
    },
    { Icon: Cloud, label: wx.cloud[locale], value: `${Math.round(c.cloud)}%` },
  ];

  return (
    <div className="space-y-6">
      <AlertList alerts={alerts} locale={locale} />
      {alerts.length > 0 && <p className="text-xs text-navy/50">{wx.alertNote[locale]}</p>}

      {/* Abhi */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-navy/70">
          {t.site.name}, {t.site.sub} · <TodayDate locale={locale} />
        </p>
        <div className="mt-3 flex items-center gap-4">
                   <WeatherIcon kind={now.kind} size={64} label={now.text[locale]} />
          <div>
            <p className="text-5xl font-bold">{Math.round(c.temp)}°C</p>
            <p className="text-navy/70">{now.text[locale]}</p>
            <p className="text-sm text-navy/60">
              {wx.feels[locale]} {Math.round(c.feels)}° · {Math.round(d0.min)}° / {Math.round(d0.max)}°
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {metrics.map(({ Icon, label, value, dir }) => (
            <div key={label} className="rounded-xl bg-cream p-3">
              <p className="flex items-center gap-1 text-xs text-navy/60">
                <Icon size={14} className="text-saffron" /> {label}
              </p>
              <p className="mt-1 flex items-center gap-1 font-bold">
                {value}
                {dir !== undefined && (
                  <ArrowUp size={14} aria-hidden="true" style={{ transform: `rotate(${dir + 180}deg)` }} />
                )}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-navy/50">
          {wx.updated[locale]} {fmtClock(w.updated)}
        </p>
      </section>

      {/* Ghante-ghante */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-bold">{wx.next24[locale]}</h2>
        <HourlyStrip hours={w.hours} locale={locale} count={24} />
      </section>

      {/* 5 din */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-bold">{wx.days5[locale]}</h2>
        <ul className="divide-y divide-navy/10">
          {w.days.map((d, i) => {
            const info = weatherInfo(d.code, true);
            const left = ((d.min - lo) / span) * 100;
            const width = Math.max(((d.max - d.min) / span) * 100, 4);
            return (
              <li key={d.date} className="grid grid-cols-[5.5rem_2rem_2.5rem_1fr] items-center gap-2 py-2 text-sm">
                <span className="font-medium">{dayLabel(d.date, i, locale)}</span>
                               <WeatherIcon kind={info.kind} size={24} label={info.text[locale]} />
                <span className="text-xs font-medium text-saffron">{d.rainProb >= 20 ? `💧${d.rainProb}%` : ""}</span>
                <span className="flex items-center gap-2">
                  <span className="w-7 text-right text-navy/60">{Math.round(d.min)}°</span>
                  <span className="relative h-2 flex-1 rounded-full bg-navy/10">
                    <span
                      className="absolute h-2 rounded-full bg-saffron"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  </span>
                  <span className="w-7 font-bold">{Math.round(d.max)}°</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Sooraj */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-bold">{wx.sun[locale]}</h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-cream p-3">
            <Sunrise className="mx-auto text-saffron" size={22} />
            <p className="mt-1 font-bold">{fmtClock(d0.sunrise)}</p>
            <p className="text-xs text-navy/60">{wx.sunrise[locale]}</p>
          </div>
          <div className="rounded-xl bg-cream p-3">
            <Sunset className="mx-auto text-saffron" size={22} />
            <p className="mt-1 font-bold">{fmtClock(d0.sunset)}</p>
            <p className="text-xs text-navy/60">{wx.sunset[locale]}</p>
          </div>
          <div className="rounded-xl bg-cream p-3">
            <Sun className="mx-auto text-saffron" size={22} />
            <p className="mt-1 font-bold">{dayLength(d0.sunrise, d0.sunset)}</p>
            <p className="text-xs text-navy/60">{wx.dayLength[locale]}</p>
          </div>
        </div>
      </section>

      {/* Hawa ki quality */}
      {aqi && w.aqi && (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold">{wx.aqiTitle[locale]}</h2>
          <div className={`rounded-xl p-4 ${aqi.style}`}>
            <p className="text-3xl font-bold">
              {Math.round(w.aqi.us)} <span className="text-base font-medium">· {aqi.label[locale]}</span>
            </p>
            <p className="mt-1 text-sm">{aqi.advice[locale]}</p>
            <p className="mt-2 text-xs">
              PM2.5: {Math.round(w.aqi.pm25)} µg/m³ · PM10: {Math.round(w.aqi.pm10)} µg/m³
            </p>
          </div>
          <p className="mt-3 text-xs text-navy/60">{wx.aqiNote[locale]}</p>
        </section>
      )}

      {/* Kisan */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 font-bold">
          <Sprout size={18} className="text-saffron" /> {pick(locale, labels.farmTips)}
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {tips.map((tip, i) => (
            <li key={i}>{tip[locale]}</li>
          ))}
        </ul>

        <div className="mt-4">
          <SprayWindow hours={w.hours} locale={locale} />
        </div>

        <h3 className="mb-2 mt-5 text-sm font-bold">{wx.irrigation[locale]}</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[300px] text-sm">
            <thead>
              <tr className="text-left text-navy/60">
                <th className="py-1 font-medium">{wx.day[locale]}</th>
                <th className="py-1 text-right font-medium">ET₀ (mm)</th>
                <th className="py-1 text-right font-medium">{wx.rainMm[locale]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {w.days.slice(0, 4).map((d, i) => (
                <tr key={d.date}>
                  <td className="py-1.5">{dayLabel(d.date, i, locale)}</td>
                  <td className="py-1.5 text-right">{d.et0.toFixed(1)}</td>
                  <td className="py-1.5 text-right font-medium text-saffron">{d.rainMm.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-navy/60">{wx.et0Note[locale]}</p>
        <p className="mt-2 text-xs text-navy/60">{pick(locale, labels.tipsNote)}</p>
      </section>

      <Attribution locale={locale} air={!!w.aqi} />
    </div>
  );
}