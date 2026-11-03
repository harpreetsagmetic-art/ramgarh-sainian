import { geo } from "@/lib/content";
import { getDictionary, type Locale } from "@/lib/i18n";
import { aqiInfo, buildAlerts, fmtClock, getWeather, weatherInfo } from "@/lib/weather";
import { wx } from "@/lib/weather-text";
import { ArrowRight, CloudRain, Droplets, MapPin, Wind } from "lucide-react";
import Link from "next/link";
import HourlyStrip from "./HourlyStrip";
import TodayDate from "./TodayDate";
import { AlertList, Attribution } from "./WeatherBits";
import WeatherIcon from "./WeatherIcon";
export default async function WeatherCard({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const w = await getWeather(geo.lat, geo.lon);

  if (!w) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">{wx.title[locale]}</h2>
        <p className="mt-2 text-navy/70">{wx.unavailable[locale]}</p>
      </div>
    );
  }

  const c = w.current;
  const now = weatherInfo(c.code, c.isDay);
  const d0 = w.days[0];
  const alerts = buildAlerts(w);
  const aqi = w.aqi ? aqiInfo(w.aqi.us) : null;

  return (
    <div className="min-w-0 space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-bold">{wx.title[locale]}</h2>
        <p className="mt-1 flex items-center gap-1 text-sm text-navy/70">
          <MapPin size={14} className="text-saffron" /> {t.site.name}, {t.site.sub}
        </p>
        <p className="text-sm text-navy/70">
          <TodayDate locale={locale} />
        </p>
      </div>

      <AlertList alerts={alerts} locale={locale} max={2} />

      <div className="flex items-center gap-4">
                <WeatherIcon kind={now.kind} size={52} label={now.text[locale]} />
        <div>
          <p className="text-4xl font-bold">{Math.round(c.temp)}°C</p>
          <p className="text-navy/70">{now.text[locale]}</p>
          <p className="text-xs text-navy/60">
            {wx.feels[locale]} {Math.round(c.feels)}° · {Math.round(d0.min)}° / {Math.round(d0.max)}°
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-cream p-2">
          <Wind size={18} className="mx-auto text-saffron" />
          <p className="font-bold">{Math.round(c.wind)} km/h</p>
          <p className="text-xs text-navy/60">{wx.wind[locale]}</p>
        </div>
        <div className="rounded-xl bg-cream p-2">
          <Droplets size={18} className="mx-auto text-saffron" />
          <p className="font-bold">{Math.round(c.humidity)}%</p>
          <p className="text-xs text-navy/60">{wx.humidity[locale]}</p>
        </div>
        <div className="rounded-xl bg-cream p-2">
          <CloudRain size={18} className="mx-auto text-saffron" />
          <p className="font-bold">{Math.round(d0.rainProb)}%</p>
          <p className="text-xs text-navy/60">{wx.rainChance[locale]}</p>
        </div>
      </div>

      {aqi && w.aqi && (
        <p className={`rounded-xl p-2 text-center text-sm font-medium ${aqi.style}`}>
          {wx.aqiTitle[locale]}: AQI {Math.round(w.aqi.us)} · {aqi.label[locale]}
        </p>
      )}

      <HourlyStrip hours={w.hours} locale={locale} count={12} />

      <div className="flex items-center justify-between gap-3">
        <Link href={`/${locale}/weather`} className="inline-flex items-center gap-1 text-sm font-bold text-saffron">
          {wx.full[locale]} <ArrowRight size={14} />
        </Link>
        <span className="text-xs text-navy/50">
          {wx.updated[locale]} {fmtClock(w.updated)}
        </span>
      </div>

      <Attribution locale={locale} air={!!w.aqi} />
    </div>
  );
}